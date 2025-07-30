import { Route } from "src/routes/routes.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";

@Entity()
export class Stop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column('int')
    sequence: number; // Order of stops in the route

    @Column({ type: 'time', nullable: true })
    arrivalTime: string; // Time when bus arrives at this stop

    @Column({ type: 'time', nullable: true })
    departureTime: string; // Time when bus departs from this stop

    @ManyToOne(() => Route, (route) => route.stops)
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 