import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}