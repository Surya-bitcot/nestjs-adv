import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dtos/create-stop.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('routes/:routeId/stops')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class StopsController {
    constructor(private readonly stopsService: StopsService) {}

    @Post()
    createStop(
        @Param('routeId') routeId: string,
        @Body() createStopDto: CreateStopDto
    ) {
        return this.stopsService.createStop(routeId, createStopDto);
    }

    @Get()
    getRouteStops(@Param('routeId') routeId: string) {
        return this.stopsService.getRouteStops(routeId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stopsService.findOne(id);
    }

    @Put(':id')
    updateStop(
        @Param('id') id: string,
        @Body() updateStopDto: Partial<CreateStopDto>
    ) {
        return this.stopsService.updateStop(id, updateStopDto);
    }

    @Delete(':id')
    removeStop(@Param('id') id: string) {
        return this.stopsService.removeStop(id);
    }

    @Post('reorder')
    reorderStops(
        @Param('routeId') routeId: string,
        @Body() body: { stopIds: string[] }
    ) {
        return this.stopsService.reorderStops(routeId, body.stopIds);
    }
} 