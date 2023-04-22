import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TagEntity } from "./tag.entity";

@Entity("extra")
export class ExtraEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  date_of_birth: Date;

  @Column()
  address: string;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags: TagEntity[];
}