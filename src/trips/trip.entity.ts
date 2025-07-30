import { Bus } from "src/buses/buses.entity";
import { Route } from "src/routes/routes.entity";
import { Booking } from "src/bookings/bookings.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Bus, { eager: true })
    @JoinColumn({ name: 'bus_id' })
    bus: Bus;

    @ManyToOne(() => Route, { eager: true })
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @Column({ type: 'date' })
    departureDate: Date;

    @Column({ type: 'time' })
    departureTime: string;

    @Column({ type: 'time' })
    arrivalTime: string;

    @Column('decimal', { precision: 10, scale: 2 })
    fare: number;

    @Column({ type: 'enum', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' })
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

    @Column('json')
    seatMap: {
        [seatNumber: string]: {
            status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
            lockedUntil?: Date;
            bookingId?: string;
        };
    };

    @OneToMany(() => Booking, (booking) => booking.trip)
    bookings: Booking[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 