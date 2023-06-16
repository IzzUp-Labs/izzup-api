import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { TagEntity } from "../../tag/entities/tag.entity";

@Entity("extra")
export class ExtraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false})
  user_id: number;

  @Column()
  address: string;

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