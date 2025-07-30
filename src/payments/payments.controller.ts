import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, ProcessRefundDto } from './dtos/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    createPayment(
        @Req() req,
        @Body() createPaymentDto: CreatePaymentDto
    ) {
        return this.paymentsService.createPayment(req.user.id, createPaymentDto);
    }

    @Post(':id/process')
    @UseGuards(RolesGuard)
    @Roles('admin')
    processPayment(
        @Param('id') paymentId: string,
        @Body() body: { transactionId: string; gatewayResponse: string }
    ) {
        return this.paymentsService.processPayment(paymentId, body.transactionId, body.gatewayResponse);
    }

    @Post('refund')
    @UseGuards(RolesGuard)
    @Roles('admin')
    processRefund(@Body() processRefundDto: ProcessRefundDto) {
        return this.paymentsService.processRefund(processRefundDto);
    }

    @Get('history')
    getPaymentHistory(@Req() req) {
        return this.paymentsService.getPaymentHistory(req.user.id);
    }

    @Get(':id')
    getPaymentById(@Param('id') paymentId: string) {
        return this.paymentsService.getPaymentById(paymentId);
    }

    @Get('booking/:bookingId')
    getPaymentByBooking(@Param('bookingId') bookingId: string) {
        return this.paymentsService.getPaymentByBooking(bookingId);
    }
} 