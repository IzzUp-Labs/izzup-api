import {CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity('app_socket_session')
export class AppSocketSessionEntity{
    @PrimaryColumn("varchar")
    clientId!: string;

    @PrimaryColumn()
    userId!: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}