import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_status')
export class UserStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {type: 'varchar', length: 50, nullable: false} )
  name: string;
}
