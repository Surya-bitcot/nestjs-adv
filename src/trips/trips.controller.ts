import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('trips')
export class TripsController {
    constructor(private readonly tripsService: TripsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    createTrip(@Body() createTripDto: CreateTripDto) {
        return this.tripsService.createTrip(createTripDto);
    }

    @Get('search')
    searchTrips(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('date') date: string
    ) {
        return this.tripsService.searchTrips(from, to, date);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tripsService.findOne(id);
    }

    @Get(':id/seat-map')
    getSeatMap(@Param('id') id: string) {
        return this.tripsService.getSeatMap(id);
    }

    @Post(':id/lock-seat')
    @UseGuards(JwtAuthGuard)
    lockSeat(
        @Param('id') tripId: string,
        @Body() body: { seatNumber: string; bookingId: string }
    ) {
        return this.tripsService.lockSeat(tripId, body.seatNumber, body.bookingId);
    }

    @Post(':id/unlock-seat')
    @UseGuards(JwtAuthGuard)
    unlockSeat(
        @Param('id') tripId: string,
        @Body() body: { seatNumber: string }
    ) {
        return this.tripsService.unlockSeat(tripId, body.seatNumber);
    }

    @Post(':id/confirm-seat')
    @UseGuards(JwtAuthGuard)
    confirmSeat(
        @Param('id') tripId: string,
        @Body() body: { seatNumber: string; bookingId: string }
    ) {
        return this.tripsService.confirmSeat(tripId, body.seatNumber, body.bookingId);
    }

    @Post(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    updateTripStatus(
        @Param('id') tripId: string,
        @Body() body: { status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }
    ) {
        return this.tripsService.updateTripStatus(tripId, body.status);
    }
} 