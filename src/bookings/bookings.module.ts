import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { Bus } from 'src/buses/buses.entity';
import { User } from 'src/users/user.entity';
import { Route } from 'src/routes/routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Bus, User, Route])],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
