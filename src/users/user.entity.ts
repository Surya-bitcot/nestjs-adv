import { Booking } from "src/bookings/bookings.entity";
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";

@Entity()
@Index(['email'])
@Index(['oauthId'])
export class User {

   @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  password: string; 

  @Column({ nullable: true, length: 255 })
  oauthId: string; 

  @Column({ nullable: true, length: 50 })
  provider: string; 

  @Column({ nullable: true, length: 500 })
  profilePicture: string; 

  @Column({ default: 'user', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id)
    }

    @AfterUpdate()
    logUpdated(){
        console.log("Updated user with id", this.id)   
    }

    @AfterRemove()
    logRemove(){
        console.log("Removed user with id", this.id)   
    }

    @OneToMany(() => Booking, (booking) => booking.user)
     bookings: Booking[];
}