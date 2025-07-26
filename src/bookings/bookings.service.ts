import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

        const existingBooking = await this.bookingRepo.findOne({
            where: { bus: { id: busId }, route: { id: routeId }, seatNumber, status: 'CONFIRMED' }
        })

        if (existingBooking) {
            throw new ConflictException('Seat already Booked')
        }

        const booking = this.bookingRepo.create(createBookingDto)

        return this.bookingRepo.save(booking)
    }



    async getBooking(id: string) {
        const booking = await this.bookingRepo.findOne({
            where: { id },
            relations: ['bus', 'route', 'user']
        })

        if (!booking) throw new NotFoundException('booking not found')

        return booking;
    }


    async updateBooking(id: string, updateBookingDto: UpdateBookingDto) {
        const booking = await this.bookingRepo.findOne({ where: { id } })

        if (!booking) throw new NotFoundException('Booking not found')

        Object.assign(booking, updateBookingDto)

        return this.bookingRepo.save(booking)
    }


    async cancellBooking(id: string) {
        const booking = await this.bookingRepo.findOne({where: {id}});
        if(!booking)  throw new NotFoundException('booking not found')
           booking.status =  'CANCELLED'
        
        return this.bookingRepo.save(booking)
    }
}
