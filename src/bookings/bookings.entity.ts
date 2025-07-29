import { Bus } from "src/buses/buses.entity";
import { Route } from "src/routes/routes.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    seatNumber: string;

    @Column({ type: 'enum', enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' })
    status: 'CONFIRMED' | 'CANCELLED';

    @CreateDateColumn()
    bookingDate: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}