import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('user_status')
export class UserStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {type: 'varchar', length: 50, nullable: false} )
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
