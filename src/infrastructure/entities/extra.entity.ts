import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('extra')
export class ExtraEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    date_of_birth: Date;

    @Column()
    address: string;

    @UpdateDateColumn()
    updated_at: Date;
}