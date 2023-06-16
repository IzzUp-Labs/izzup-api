import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("employer")
export class EmployerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false})
  user_id: number;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}