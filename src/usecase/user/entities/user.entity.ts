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
import {DeviceEntity} from "../../device/entities/device.entity";
import {RatingEntity} from "../../rating/entities/rating.entity";
import {BadgeRatingEntity} from "../../rating/entities/badge-rating.entity";

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

  @OneToOne(() => EmployerEntity, (employer) => employer.user, { onDelete: "CASCADE" })
  @JoinColumn()
  employer: EmployerEntity;

  @OneToOne(() => ExtraEntity, (extra) => extra.user, { onDelete: "CASCADE" })
  @JoinColumn()
  extra: ExtraEntity;

  @ManyToMany(() => UserStatusEntity, { cascade: true })
  @JoinTable()
  statuses: UserStatusEntity[];

  @OneToMany(() => MessagingRoomEntity, (messageRoom) => messageRoom.participant, { onDelete: "CASCADE" })
  rooms: MessagingRoomEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.device_id, { onDelete: "CASCADE" })
  devices: DeviceEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.target, { onDelete: "CASCADE" })
  ratings: RatingEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.author, { onDelete: "CASCADE" })
  rated_users: RatingEntity[];

  @OneToMany(() => BadgeRatingEntity, (badgeRating) => badgeRating.target, { onDelete: "CASCADE" })
  badge_ratings: BadgeRatingEntity[];

  @OneToMany(() => BadgeRatingEntity, (badgeRating) => badgeRating.author, { onDelete: "CASCADE" })
  badge_rated_users: BadgeRatingEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
