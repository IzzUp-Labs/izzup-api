import {Entity, PrimaryColumn} from "typeorm";

@Entity('app_socket_session')
export class AppSocketSessionEntity{
    @PrimaryColumn("varchar")
    clientId!: string;

    @PrimaryColumn()
    userId!: number;
}