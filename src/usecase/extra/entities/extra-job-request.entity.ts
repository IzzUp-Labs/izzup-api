import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('extra_job_request')
export class ExtraJobRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  extraId: number;

  @Column()
  status: string;
}