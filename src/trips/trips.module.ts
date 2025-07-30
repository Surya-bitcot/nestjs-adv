import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './trip.entity';
import { Bus } from '../buses/buses.entity';
import { Route } from '../routes/routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Bus, Route])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService]
})
export class TripsModule {} 