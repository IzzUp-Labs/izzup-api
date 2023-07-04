import {CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity('messaging_session')
export class MessagingSessionEntity {
    @PrimaryColumn("varchar")
    clientId!: string;

    @PrimaryColumn("varchar")
    userId!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}