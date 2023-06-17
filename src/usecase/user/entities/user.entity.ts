import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {EmployerEntity} from "../../employer/entities/employer.entity";
import {ExtraEntity} from "../../extra/entities/extra.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  last_name: string;

  @Column()
  first_name: string;

  @Column({type: 'date', nullable: false})
  date_of_birth: Date;

  @Column()
  role: string;

  @OneToOne(() => EmployerEntity, (employer) => employer.user, {cascade: true})
  @JoinColumn()
  employer: EmployerEntity;

  @OneToOne(() => ExtraEntity, (extra) => extra.user, {cascade: true})
  @JoinColumn()
  extra: ExtraEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}