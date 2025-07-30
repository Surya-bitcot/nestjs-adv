import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/trip.entity';
import { User } from 'src/users/user.entity';
import { CreateBooking } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(Trip) private tripRepo: Repository<Trip>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async createBooking(userId: number, createBookingDto: CreateBooking) {
        const { tripId, seatNumber } = createBookingDto;

        // Validate that trip and user exist
        const trip = await this.tripRepo.findOne({ 
            where: { id: tripId },
            relations: ['bus', 'route']
        });
        if (!trip) {
            throw new NotFoundException('Trip not found');
        }

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if seat is already booked for this trip
        const existingBooking = await this.bookingRepo.findOne({
            where: { 
                trip: { id: tripId }, 
                seatNumber, 
                status: 'CONFIRMED' 
            }
        });

        if (existingBooking) {
            throw new ConflictException('Seat already booked');
        }

        // Validate seat number against bus capacity
        if (parseInt(seatNumber) > trip.bus.capacity || parseInt(seatNumber) < 1) {
            throw new BadRequestException('Invalid seat number');
        }

        // Check if trip is in the future
        const departureDateTime = new Date(`${trip.departureDate} ${trip.departureTime}`);
        if (departureDateTime <= new Date()) {
            throw new BadRequestException('Cannot book seats for past trips');
        }

        const booking = this.bookingRepo.create({
            trip,
            bus: trip.bus,
            route: trip.route,
            user,
            seatNumber,
            fare: trip.fare,
            status: 'PENDING'
        });

        return this.bookingRepo.save(booking);
    }

    async getBooking(id: string) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['bus', 'route', 'user']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    async getAllBookings() {
        return await this.bookingRepo.find({
            relations: ['bus', 'route', 'user'],
            order: { bookingDate: 'DESC' }
        });
    }

    async getUserBookings(userId: number) {
        return await this.bookingRepo.find({
            where: { user: { id: userId } },
            relations: ['bus', 'route'],
            order: { bookingDate: 'DESC' }
        });
    }

    async updateBooking(id: string, updateBookingDto: UpdateBookingDto) {
        const booking = await this.bookingRepo.findOne({ where: { id } });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Prevent updating cancelled bookings
        if (booking.status === 'CANCELLED') {
            throw new BadRequestException('Cannot update cancelled booking');
        }

        Object.assign(booking, updateBookingDto);
        return this.bookingRepo.save(booking);
    }

    async cancelBooking(id: string) {
        const booking = await this.bookingRepo.findOne({ where: { id } });
        
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status === 'CANCELLED') {
            throw new BadRequestException('Booking is already cancelled');
        }

        booking.status = 'CANCELLED';
        return this.bookingRepo.save(booking);
    }
}
