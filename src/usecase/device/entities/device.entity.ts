import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity("user_device")
export class DeviceEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.devices)
    user: UserEntity;

    @Column({ type: "varchar", nullable: false, unique: true })
    device_id: string;

    @Column({ type: "varchar", nullable: false })
    fcm_token: string;

    @Column({ type: "varchar", nullable: false })
    device_language: string;

    @Column({ type: "boolean", nullable: false, default: false})
    notification_enabled: boolean;
}
