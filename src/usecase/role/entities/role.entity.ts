import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', nullable: false, unique: true})
  name: string;
}