import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ExtraJobRequestEntity } from "../../extra/entities/extra-job-request.entity";
import {CompanyEntity} from "../../company/entities/company.entity";

@Entity('job-offer')
export class JobOfferEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  job_title: string;

  @Column()
  price: number;

  @Column()
  is_available: boolean;

  @Column()
  spots: number;

  @ManyToOne(() => CompanyEntity, (company) => company.jobOffers)
  company: CompanyEntity;

  @OneToMany(() => ExtraJobRequestEntity, (request) => request.jobOffer)
  requests: ExtraJobRequestEntity[];
}