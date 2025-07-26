import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from './db/database';
import { BusesModule } from './buses/buses.module';
import { RoutesModule } from './routes/routes.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions), 
    UsersModule, BusesModule, RoutesModule, BookingsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
