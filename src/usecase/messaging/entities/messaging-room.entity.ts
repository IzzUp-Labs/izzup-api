import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { MessagingEntity } from "./messaging.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity("messaging_room")
export class MessagingRoomEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => MessagingEntity, (message) => message.room)
  messages!: MessagingEntity[];

  @ManyToOne(() => UserEntity, (user) => user.rooms, { cascade: true })
  participant!: UserEntity;

  @ManyToOne(() => UserEntity)
  createdBy!: UserEntity;

  @CreateDateColumn()
  creationDate!: Date;

  @UpdateDateColumn()
  updatedOn?: Date;

  @DeleteDateColumn()
  deletionDate?: Date;
}
