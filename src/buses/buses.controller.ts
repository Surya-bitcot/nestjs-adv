import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBus } from './dtos/create-bus.dto';

@Controller('buses')
export class BusesController {
    constructor(private readonly busesService: BusesService) { }


    @Get()
    async findAll() {
        return this.busesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.busesService.findOne(id);
    }   

    @Post()
    async create(@Body() createBusDto: CreateBus) {
        return this.busesService.create(createBusDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateBusDto: CreateBus) {
        return this.busesService.update(id, updateBusDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.busesService.remove(id);
    }
}
