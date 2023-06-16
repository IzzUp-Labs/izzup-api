import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ActivitySectorEntity } from "../../activity-sector/entities/activity-sector.entity";

@Entity("company")
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false})
  employer_id: number;

  @Column({type: 'varchar', length: 100, nullable: false})
  name: string;

  @Column({type: 'varchar', length: 150, nullable: false})
  address: string;

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