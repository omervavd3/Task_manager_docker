import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  
  @Column()
  password: string;


  @Column()
  email: string;

  @Column()
  token: string;
}