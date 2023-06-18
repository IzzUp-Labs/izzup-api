import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ExtraEntity} from "./extra.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";

@Entity('extra_job_request')
export class ExtraJobRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @ManyToOne(() => ExtraEntity, (extra) => extra.requests)
  extra: ExtraEntity;

  @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.requests)
  jobOffer: JobOfferEntity;
}