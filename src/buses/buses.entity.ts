import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('int')
    capacity: number;

    @Column('json')
    seatLayout: string[][];
}