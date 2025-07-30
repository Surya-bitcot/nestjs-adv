import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TripsModule } from '../trips/trips.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TripsModule,
    SearchModule
  ],
  providers: [SchedulerService]
})
export class SchedulerModule {} 