import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('job_status')
export class JobStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false, unique: true})
  status: string;
}