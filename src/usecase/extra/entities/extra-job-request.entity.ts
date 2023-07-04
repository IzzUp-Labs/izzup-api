import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
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

  @Column({type: "numeric", nullable: true, precision: 6, scale: 0})
  verification_code: number;

  @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.requests)
  jobOffer: JobOfferEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}