import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BadgeRatingEntity} from "./badge-rating.entity";

@Entity("badge")
export class BadgeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column("varchar")
    name_fr: string;
    @Column("varchar")
    name_en: string;
    @Column("varchar")
    description_fr: string;
    @Column("varchar")
    description_en: string;
    @Column("varchar", {nullable: true})
    image: string;
    @Column("boolean")
    is_extra: boolean;
    @OneToMany(() => BadgeRatingEntity, (badgeRating) => badgeRating.badge)
    ratings: BadgeRatingEntity[];
}