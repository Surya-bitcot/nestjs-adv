import { Bus } from "src/buses/buses.entity";
import { Route } from "src/routes/routes.entity";
import { User } from "src/users/user.entity";
import { Trip } from "src/trips/trip.entity";
import { Payment } from "src/payments/payment.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Booking {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Bus, { eager: true })
    @JoinColumn({ name: 'bus_id' })
    bus: Bus;

    @ManyToOne(() => Route, { eager: true })
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @ManyToOne(() => Trip, { eager: true })
    @JoinColumn({ name: 'trip_id' })
    trip: Trip;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    seatNumber: string;

    @Column({ type: 'enum', enum: ['CONFIRMED', 'CANCELLED', 'PENDING'], default: 'PENDING' })
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';

    @Column('decimal', { precision: 10, scale: 2 })
    fare: number;

    @Column({ type: 'timestamp', nullable: true })
    lockedUntil: Date;

    @OneToMany(() => Payment, (payment) => payment.booking)
    payments: Payment[];

    @CreateDateColumn()
    bookingDate: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}