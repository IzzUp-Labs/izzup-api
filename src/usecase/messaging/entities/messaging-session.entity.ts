import {Entity, PrimaryColumn} from "typeorm";

@Entity('messaging_session')
export class MessagingSessionEntity {
    @PrimaryColumn("varchar")
    clientId!: string;

    @PrimaryColumn("varchar")
    userId!: number;
}