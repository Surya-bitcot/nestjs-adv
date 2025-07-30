import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StopsController } from './stops.controller';
import { StopsService } from './stops.service';
import { Stop } from './stop.entity';
import { Route } from '../routes/routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stop, Route])],
  controllers: [StopsController],
  providers: [StopsService],
  exports: [StopsService]
})
export class StopsModule {} 