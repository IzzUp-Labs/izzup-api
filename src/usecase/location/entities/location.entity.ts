import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {CompanyEntity} from "../../company/entities/company.entity";

@Entity("company_location")
export class LocationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"numeric" ,nullable: false})
    longitude: number;

    @Column({type:"numeric",nullable: false})
    latitude: number;

    @OneToOne(() => CompanyEntity, (company) => company.location)
    company: CompanyEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
