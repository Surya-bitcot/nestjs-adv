import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

   @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string; 

  @Column({ nullable: true })
  oauthId: string; 

  @Column({ nullable: true })
  provider: string; 

  @Column({ nullable: true })
  profilePicture: string; 

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
}