import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity, JoinColumn,
  JoinTable,
  ManyToMany, ManyToOne, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ActivitySectorEntity } from "../../activity-sector/entities/activity-sector.entity";
import {EmployerEntity} from "../../employer/entities/employer.entity";
import {JobOfferEntity} from "../../job-offer/entities/job-offer.entity";
import {LocationEntity} from "../../location/entities/location.entity";

@Entity("company")
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 100, nullable: false, unique: true})
  place_id: string;

  @Column({type: 'varchar', length: 100, nullable: false})
  name: string;

  @Column({type: 'varchar', length: 150, nullable: false})
  address: string;

  @OneToOne(() => LocationEntity, (location) => location.company, {cascade: true})
  @JoinColumn()
  location: LocationEntity;

  @OneToMany(() => JobOfferEntity, (jobOffer) => jobOffer.company, {cascade: true})
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