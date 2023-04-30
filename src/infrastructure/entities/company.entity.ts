import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ActivitySectorEntity } from "./activity-sector.entity";

@Entity("company")
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employer_id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @ManyToMany(() => ActivitySectorEntity)
  @JoinTable()
  sectors: ActivitySectorEntity[];

  @UpdateDateColumn()
  updated_at: Date;
}