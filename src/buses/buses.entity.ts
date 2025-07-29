import { Booking } from "src/bookings/bookings.entity";
import { Route } from "src/routes/routes.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";

@Entity()
export class Bus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column('int')
    capacity: number;

    @Column('json')
    seatLayout: string[][];

    @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'], default: 'ACTIVE' })
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

    @OneToMany(() => Booking, (booking) => booking.bus)
    bookings: Booking[];

    @ManyToOne(() => Route, (route) => route.buses)
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}