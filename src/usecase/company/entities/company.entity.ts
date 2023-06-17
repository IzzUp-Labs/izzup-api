import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ActivitySectorEntity } from "../../activity-sector/entities/activity-sector.entity";
import {EmployerEntity} from "../../employer/entities/employer.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";

@Entity("company")
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 100, nullable: false})
  name: string;

  @Column({type: 'varchar', length: 150, nullable: false})
  address: string;

  @OneToMany(() => JobOfferEntity, (jobOffer) => jobOffer.company)
  jobOffers: JobOfferEntity[];

  @ManyToOne(() => EmployerEntity, (employer) => employer.companies)
  employer: EmployerEntity;

  @ManyToMany(() => ActivitySectorEntity)
  @JoinTable()
  sectors: ActivitySectorEntity[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}