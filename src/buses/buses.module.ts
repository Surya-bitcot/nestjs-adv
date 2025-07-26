import { Module } from '@nestjs/common';
import { BusesController } from './buses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusesService } from './buses.service';
import { Bus } from './buses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
  controllers: [BusesController],
  providers: [BusesService],
  exports: [BusesService]
})
export class BusesModule {}
