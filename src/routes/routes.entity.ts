import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    startLocation: string;

    @Column()
    endLocation: string;

    @Column()
    distance: number;

    @Column()
    duration: number;
}
