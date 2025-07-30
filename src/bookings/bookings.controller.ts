import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBooking } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingService: BookingsService) { }

    @Post()
    createBooking(@Body() createBookingDto: CreateBooking, @Req() req) {
        return this.bookingService.createBooking(req.user.id, createBookingDto);
    }

    @Get()
    getAllBookings() {
        return this.bookingService.getAllBookings();
    }

    @Get('my-bookings')
    getMyBookings(@Req() req) {
        return this.bookingService.getUserBookings(req.user.id);
    }

    @Get(':id')
    getBooking(@Param('id') id: string) {
        return this.bookingService.getBooking(id);
    }

    @Patch(':id')
    updateBooking(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingService.updateBooking(id, updateBookingDto);
    }

    @Delete(':id')
    cancelBooking(@Param('id') id: string) {
        return this.bookingService.cancelBooking(id);
    }
}
