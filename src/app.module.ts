import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from './db/database';
import { BusesModule } from './buses/buses.module';
import { RoutesModule } from './routes/routes.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { TripsModule } from './trips/trips.module';
import { StopsModule } from './stops/stops.module';
import { PaymentsModule } from './payments/payments.module';
import { SearchModule } from './search/search.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions), 
    UsersModule, 
    BusesModule, 
    RoutesModule, 
    BookingsModule,
    AuthModule,
    TripsModule,
    StopsModule,
    PaymentsModule,
    SearchModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
