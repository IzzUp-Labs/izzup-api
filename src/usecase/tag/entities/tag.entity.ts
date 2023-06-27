import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false, unique: true})
  name: string;

  @Column({type: 'varchar', nullable: false})
  color: string;
}