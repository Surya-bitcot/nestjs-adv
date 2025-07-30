import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Bus } from '../buses/buses.entity';
import { Route } from '../routes/routes.entity';
import { CreateTripDto } from './dtos/create-trip.dto';

// Define seat status type
type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';

interface SeatInfo {
    status: SeatStatus;
    lockedUntil: Date | null;
    bookingId: string | null;
}

@Injectable()
export class TripsService {
    constructor(
        @InjectRepository(Trip) private tripRepo: Repository<Trip>,
        @InjectRepository(Bus) private busRepo: Repository<Bus>,
        @InjectRepository(Route) private routeRepo: Repository<Route>,
    ) { }

    // Helper to safely retrieve and type a seat
    private getSeat(trip: Trip, seatNumber: string): SeatInfo {
        const seat = trip.seatMap[seatNumber] as SeatInfo | undefined;
        if (!seat) {
            throw new BadRequestException('Invalid seat number');
        }
        return seat;
    }

    async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
        const { busId, routeId, departureDate, departureTime, arrivalTime, fare } =
            createTripDto;

        const bus = await this.busRepo.findOne({ where: { id: busId } });
        if (!bus) {
            throw new NotFoundException('Bus not found');
        }

        const route = await this.routeRepo.findOne({ where: { id: routeId } });
        if (!route) {
            throw new NotFoundException('Route not found');
        }

        const seatMap: { [key: string]: SeatInfo } = {};
        for (let i = 1; i <= bus.capacity; i++) {
            seatMap[i.toString()] = {
                status: 'AVAILABLE',
                lockedUntil: null,
                bookingId: null,
            };
        }

        const trip = this.tripRepo.create({
            bus,
            route,
            departureDate: new Date(departureDate),
            departureTime,
            arrivalTime,
            fare,
            seatMap,
        });

        return await this.tripRepo.save(trip);
    }

    async findOne(id: string): Promise<Trip> {
        const trip = await this.tripRepo.findOne({
            where: { id },
            relations: ['bus', 'route', 'route.stops'],
        });

        if (!trip) {
            throw new NotFoundException('Trip not found');
        }

        return trip;
    }

    async searchTrips(from: string, to: string, date: string): Promise<Trip[]> {
        return await this.tripRepo.find({
            where: {
                route: {
                    startLocation: from,
                    endLocation: to,
                },
                departureDate: new Date(date),
                status: 'SCHEDULED',
            },
            relations: ['bus', 'route'],
            order: { departureTime: 'ASC' },
        });
    }

    async getSeatMap(tripId: string): Promise<any> {
        const trip = await this.findOne(tripId);
        return trip.seatMap;
    }

    async lockSeat(
        tripId: string,
        seatNumber: string,
        bookingId: string,
        lockDuration: number = 300,
    ): Promise<boolean> {
        const trip = await this.findOne(tripId);
        const seat = this.getSeat(trip, seatNumber); // typed SeatInfo

        // 👇 TypeScript now understands this properly
        if (seat.status === 'LOCKED' && seat.lockedUntil) {
            const lockExpiry = new Date(seat.lockedUntil);
            if (lockExpiry > new Date()) {
                throw new ConflictException('Seat is already locked');
            }
        }

        if (seat.status !== 'AVAILABLE') {
            throw new ConflictException('Seat is not available');
        }

        trip.seatMap[seatNumber] = {
            status: 'LOCKED',
            lockedUntil: new Date(Date.now() + lockDuration * 1000),
            bookingId,
        };

        await this.tripRepo.save(trip);
        return true;
    }

    async unlockSeat(tripId: string, seatNumber: string): Promise<boolean> {
        const trip = await this.findOne(tripId);
        const seat = this.getSeat(trip, seatNumber);

        if (seat.status === 'LOCKED') {
            trip.seatMap[seatNumber] = {
                status: 'AVAILABLE',
                lockedUntil: null,
                bookingId: null,
            };

            await this.tripRepo.save(trip);
        }

        return true;
    }

    async confirmSeat(
        tripId: string,
        seatNumber: string,
        bookingId: string,
    ): Promise<boolean> {
        const trip = await this.findOne(tripId);
        const seat = this.getSeat(trip, seatNumber);

        if (seat.status === 'LOCKED' && seat.bookingId === bookingId) {
            trip.seatMap[seatNumber] = {
                status: 'BOOKED',
                lockedUntil: null,
                bookingId,
            };

            await this.tripRepo.save(trip);
            return true;
        }

        throw new ConflictException('Seat is not locked for this booking');
    }

    async cleanupExpiredLocks(): Promise<void> {
        const trips = await this.tripRepo.find();
        const now = new Date();

        for (const trip of trips) {
            let updated = false;

            for (const seatNumber in trip.seatMap) {
                const seat = trip.seatMap[seatNumber] as SeatInfo;

                if (
                    seat.status === 'LOCKED' &&
                    seat.lockedUntil &&
                    new Date(seat.lockedUntil) < now
                ) {
                    trip.seatMap[seatNumber] = {
                        status: 'AVAILABLE',
                        lockedUntil: null,
                        bookingId: null,
                    };
                    updated = true;
                }
            }

            if (updated) {
                await this.tripRepo.save(trip);
            }
        }
    }

    async updateTripStatus(
        tripId: string,
        status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    ): Promise<Trip> {
        const trip = await this.findOne(tripId);
        trip.status = status;
        return await this.tripRepo.save(trip);
    }
}
