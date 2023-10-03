import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {BadgeEntity} from "./badge.entity";

@Entity("badge_rating")
export class BadgeRatingEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.badge_rated_users)
    author!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.badge_ratings)
    target!: UserEntity;

    @ManyToOne(() => BadgeEntity, (badge) => badge.ratings)
    badge!: BadgeEntity;
}