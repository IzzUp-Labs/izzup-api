import {Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('extra')
export class ExtraEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    last_name: string;

    @Column()
    first_name: string;

    @Column()
    date_of_birth: Date;

    @Column()
    address: string;

    @Column()
    function: string;

    @UpdateDateColumn()
    updated_at: Date;
}