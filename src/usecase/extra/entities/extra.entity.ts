import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { TagEntity } from "../../tag/entities/tag.entity";
import {UserEntity} from "../../user/entities/user.entity";
import {ExtraJobRequestEntity} from "./extra-job-request.entity";

@Entity("extra")
export class ExtraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @OneToOne(() => UserEntity, (user) => user.extra)
  user: UserEntity;

  @OneToMany(() => ExtraJobRequestEntity, (request) => request.extra)
  requests: ExtraJobRequestEntity[];

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags: TagEntity[];

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}