import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('job_status')
export class JobStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;
}