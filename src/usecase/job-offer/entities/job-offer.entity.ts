import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { ExtraJobRequestEntity } from "../../extra/entities/extra-job-request.entity";
import {CompanyEntity} from "../../company/entities/company.entity";

@Entity('job-offer')
export class JobOfferEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false})
  job_title: string;

  @Column({type: 'varchar', nullable: false})
  job_description: string;

  @Column({nullable: false})
  starting_date: Date;

  @Column({nullable: false})
  working_hours: number;

  @Column({nullable: false})
  price: number;

  @Column({type: 'boolean', nullable: false})
  is_available: boolean;

  @Column({nullable: false})
  spots: number;

  @Column({nullable: false})
  acceptedSpots: number;

  @ManyToOne(() => CompanyEntity, (company) => company.jobOffers)
  company: CompanyEntity;

  @OneToMany(() => ExtraJobRequestEntity, (request) => request.jobOffer)
  requests: ExtraJobRequestEntity[];
}