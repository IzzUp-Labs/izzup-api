import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BadgeRatingEntity} from "./badge-rating.entity";

@Entity("badge")
export class BadgeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column("varchar")
    name: string;
    @Column("varchar")
    description: string;
    @Column("varchar", {nullable: true})
    image: string;
    @Column("boolean")
    is_extra: boolean;
    @OneToMany(() => BadgeRatingEntity, (badgeRating) => badgeRating.badge)
    ratings: BadgeRatingEntity[];
}