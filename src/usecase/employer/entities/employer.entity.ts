import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { CompanyEntity } from "../../company/entities/company.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity("employer")
export class EmployerEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity, user => user.employer)
  user: UserEntity;

  @OneToMany(() => CompanyEntity, (company) => company.employer, { cascade: true })
  companies: CompanyEntity[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
