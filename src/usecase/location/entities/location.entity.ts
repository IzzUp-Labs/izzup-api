import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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
}
