import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('activity_sector')
export class ActivitySectorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}