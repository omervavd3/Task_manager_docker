import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  userId: string;


  @Column()
  date: string;


  @Column()
  isComplete: boolean;
}