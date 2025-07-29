import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Repository } from 'typeorm';
import { Bus } from 'src/buses/buses.entity';
import { Route } from 'src/routes/routes.entity';
import { User } from 'src/users/user.entity';
import { CreateBooking } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(Bus) private busRepo: Repository<Bus>,
        @InjectRepository(Route) private routeRepo: Repository<Route>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async createBooking(createBookingDto: CreateBooking) {
        const { busId, routeId, seatNumber, userId } = createBookingDto;

        // Validate that bus, route, and user exist
        const bus = await this.busRepo.findOne({ where: { id: busId } });
        if (!bus) {
            throw new NotFoundException('Bus not found');
        }

        const route = await this.routeRepo.findOne({ where: { id: routeId } });
        if (!route) {
            throw new NotFoundException('Route not found');
        }

        const user = await this.userRepo.findOne({ where: { id: parseInt(userId) } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if seat is already booked
        const existingBooking = await this.bookingRepo.findOne({
            where: { 
                bus: { id: busId }, 
                route: { id: routeId }, 
                seatNumber, 
                status: 'CONFIRMED' 
            }
        });

        if (existingBooking) {
            throw new ConflictException('Seat already booked');
        }

        // Validate seat number against bus capacity
        if (parseInt(seatNumber) > bus.capacity || parseInt(seatNumber) < 1) {
            throw new BadRequestException('Invalid seat number');
        }

        const booking = this.bookingRepo.create({
            bus,
            route,
            user,
            seatNumber,
            status: 'CONFIRMED'
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
