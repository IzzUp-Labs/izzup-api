import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity("rating")
export class RatingEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("smallint")
    stars: number;

    @ManyToOne(() => UserEntity, (user) => user.rated_users)
    author!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.ratings)
    target!: UserEntity;

    @Column("varchar")
    comment: string;
}
