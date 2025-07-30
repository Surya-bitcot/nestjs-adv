import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Booking } from '../bookings/bookings.entity';
import { User } from '../users/user.entity';
import { CreatePaymentDto, ProcessRefundDto } from './dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
        @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async createPayment(userId: number, createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const { bookingId, amount, paymentMethod } = createPaymentDto;

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Check if payment already exists for this booking
        const existingPayment = await this.paymentRepo.findOne({
            where: { booking: { id: bookingId } }
        });

        if (existingPayment) {
            throw new ConflictException('Payment already exists for this booking');
        }

        // Validate payment amount matches booking fare
        if (amount !== booking.fare) {
            throw new BadRequestException('Payment amount does not match booking fare');
        }

        const payment = this.paymentRepo.create({
            user,
            booking,
            amount,
            paymentMethod,
            status: 'PENDING'
        });

        return await this.paymentRepo.save(payment);
    }

    async processPayment(paymentId: string, transactionId: string, gatewayResponse: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.status !== 'PENDING') {
            throw new BadRequestException('Payment is not in pending status');
        }

        // Simulate payment processing
        payment.status = 'COMPLETED';
        payment.transactionId = transactionId;
        payment.gatewayResponse = gatewayResponse;

        // Update booking status to confirmed
        const booking = await this.bookingRepo.findOne({ where: { id: payment.booking.id } });
        if (booking) {
            booking.status = 'CONFIRMED';
            await this.bookingRepo.save(booking);
        }

        return await this.paymentRepo.save(payment);
    }

    async processRefund(processRefundDto: ProcessRefundDto): Promise<Payment> {
        const { paymentId, refundReason } = processRefundDto;

        const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (payment.status !== 'COMPLETED') {
            throw new BadRequestException('Payment must be completed to process refund');
        }

        // Check if booking is within refund window (e.g., 24 hours before departure)
        const booking = await this.bookingRepo.findOne({ where: { id: payment.booking.id } });
        if (booking) {
            const trip = booking.trip;
            const departureTime = new Date(`${trip.departureDate} ${trip.departureTime}`);
            const now = new Date();
            const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);

            if (hoursUntilDeparture < 24) {
                throw new BadRequestException('Refund not allowed within 24 hours of departure');
            }
        }

        payment.status = 'REFUNDED';
        payment.refundedAt = new Date();
        payment.refundReason = refundReason;

        // Update booking status to cancelled
        if (booking) {
            booking.status = 'CANCELLED';
            await this.bookingRepo.save(booking);
        }

        return await this.paymentRepo.save(payment);
    }

    async getPaymentHistory(userId: number): Promise<Payment[]> {
        return await this.paymentRepo.find({
            where: { user: { id: userId } },
            relations: ['booking', 'booking.trip'],
            order: { createdAt: 'DESC' }
        });
    }

    async getPaymentById(paymentId: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
            relations: ['user', 'booking', 'booking.trip']
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        return payment;
    }

    async getPaymentByBooking(bookingId: string): Promise<Payment> {
        const payment = await this.paymentRepo.findOne({
            where: { booking: { id: bookingId } },
            relations: ['user', 'booking']
        });

        if (!payment) {
            throw new NotFoundException('Payment not found for this booking');
        }

        return payment;
    }
} 