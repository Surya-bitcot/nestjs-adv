import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Trip } from 'src/trips/trip.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Trip, User])],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
