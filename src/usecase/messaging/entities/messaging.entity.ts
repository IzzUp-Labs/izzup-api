import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { MessagingRoomEntity } from "./messaging-room.entity";

@Entity("messaging")
export class MessagingEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  author!: UserEntity;

  @Column("varchar")
  content!: string;

  @ManyToOne(() => MessagingRoomEntity, (messageRoom) => messageRoom.messages)
  room!: MessagingRoomEntity;

  @CreateDateColumn()
  creationDate!: Date;
}
