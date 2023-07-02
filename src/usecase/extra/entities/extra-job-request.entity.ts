import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ExtraEntity} from "./extra.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";

@Entity('extra_job_request')
export class ExtraJobRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false})
  status: string;

  @ManyToOne(() => ExtraEntity, (extra) => extra.requests)
  extra: ExtraEntity;

  @Column({nullable: true, precision: 4})
  verification_code: number;

  @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.requests)
  jobOffer: JobOfferEntity;
}