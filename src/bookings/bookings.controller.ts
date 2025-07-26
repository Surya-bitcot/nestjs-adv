import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBooking } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingsService) { }

    @Post()
    createBooking(@Body() createBookingDto: CreateBooking) {
        return this.bookingService.createBooking(createBookingDto)
    }

    @Get(':id')
    getBooking(@Param(':id') id: string) {
        return this.bookingService.getBooking(id)
    }

    @Patch(':id')
    updateBooking(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
        return this.bookingService.updateBooking(id, updateBookingDto);
    }

    @Delete(':id')
    cancelBooking(@Param('id') id: string) {
        return this.bookingService.cancellBooking(id)
    }


}
