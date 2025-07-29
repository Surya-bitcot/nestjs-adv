import { Bus } from "src/buses/buses.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Route {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    startLocation: string;

    @Column()
    endLocation: string;

    @Column('decimal', { precision: 10, scale: 2 })
    distance: number;

    @Column('int')
    duration: number; // in minutes

    @OneToMany(() => Bus, (bus) => bus.route)
    buses: Bus[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
