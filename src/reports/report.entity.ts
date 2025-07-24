import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class report {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;
    
}