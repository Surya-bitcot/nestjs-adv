import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoutesService } from './routes.services';
import { CreateRouteDto } from './dtos/create-routes.dto';

@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Get()
    async findAll() {
        return this.routesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.routesService.findOne(id);
    }

    @Post()
    async create(@Body() createRouteDto: CreateRouteDto) {
        return this.routesService.create(createRouteDto);
    }


    @Post(':id')
    async update(@Param('id') id: string, @Body() updateRouteDto: CreateRouteDto) {
        return this.routesService.update(id, updateRouteDto);
    }


    @Post(':id/delete')
    async delete(@Param('id') id: string) {
        return this.routesService.delete(id);
    }
 
}
