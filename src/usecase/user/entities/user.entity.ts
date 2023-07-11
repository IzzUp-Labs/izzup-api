import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { EmployerEntity } from "../../employer/entities/employer.entity";
import { ExtraEntity } from "../../extra/entities/extra.entity";
import { UserStatusEntity } from "../../user-status/entities/user-status.entity";
import { MessagingRoomEntity } from "../../messaging/entities/messaging-room.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  email: string;

  @Column({ type: "boolean", nullable: false, default: false })
  is_email_confirmed: boolean;

  @Column({ type: "numeric", nullable: true, precision: 5, scale: 0 })
  email_confirmation_code: number;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "varchar", nullable: false })
  last_name: string;

  @Column({ type: "varchar", nullable: false })
  first_name: string;

  @Column({ type: "date", nullable: false })
  date_of_birth: Date;

  @Column({ type: "varchar", nullable: true })
  photo: string;

  @Column({ type: "varchar", nullable: false })
  role: string;

  @Column({ type: "varchar", nullable: true })
  id_photo: string;

  @Column({ type: "varchar", nullable: true })
  fcm_tokens: string[];

  @OneToOne(() => EmployerEntity, (employer) => employer.user, { cascade: true })
  @JoinColumn()
  employer: EmployerEntity;

  @OneToOne(() => ExtraEntity, (extra) => extra.user, { cascade: true })
  @JoinColumn()
  extra: ExtraEntity;

  @ManyToMany(() => UserStatusEntity)
  @JoinTable()
  statuses: UserStatusEntity[];

  @OneToMany(() => MessagingRoomEntity, (messageRoom) => messageRoom.participant)
  rooms: MessagingRoomEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
