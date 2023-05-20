import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('id_photo')
export class IdPhotoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  photo: string;
}