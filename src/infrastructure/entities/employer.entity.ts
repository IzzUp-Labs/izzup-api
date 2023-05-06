import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("employer")
export class EmployerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  date_of_birth: Date;

  @UpdateDateColumn()
  updated_at: Date;
}