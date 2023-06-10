import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExtraJobRequestEntity } from "./extra-job-request.entity";

@Entity('job-offer')
export class JobOfferEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company_id: number;

  @Column()
  job_title: string;

  @Column()
  price: number;

  @Column()
  is_available: boolean;

  @Column()
  spots: number;

  @ManyToMany(() => ExtraJobRequestEntity)
  @JoinTable()
  requests: ExtraJobRequestEntity[];

}