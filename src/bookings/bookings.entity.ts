import { join } from "path";
import { Bus } from "src/buses/buses.entity";
import { Route } from "src/routes/routes.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Booking {

    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(()=>Bus, {eager: true})
    @JoinColumn({name:'bus_id'})
    bus: Bus;

    @ManyToOne(()=>Route, {eager:true})
    @JoinColumn({name:'route_id'})
    route:Route;

    @ManyToOne(()=> User, {eager: true})
    @JoinColumn({name:'user_id'})
    user: User;

    @Column()
    seatNumber: string;

    @Column({type: 'varchar', default: 'CONFIRMED'})
    status: 'CONFIRMED' | 'CANCELLED';

    @Column({type: 'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    bookingDate: Date;

}