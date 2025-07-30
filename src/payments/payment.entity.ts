import { User } from "src/users/user.entity";
import { Booking } from "src/bookings/bookings.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Booking, { eager: true })
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], default: 'PENDING' })
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

    @Column({ type: 'enum', enum: ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'WALLET', 'NET_BANKING'], nullable: true })
    paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'WALLET' | 'NET_BANKING';

    @Column({ nullable: true })
    transactionId: string;

    @Column({ nullable: true })
    gatewayResponse: string;

    @Column({ type: 'text', nullable: true })
    failureReason: string;

    @Column({ type: 'timestamp', nullable: true })
    refundedAt: Date;

    @Column({ type: 'text', nullable: true })
    refundReason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 