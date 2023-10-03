import {ApiProperty} from "@nestjs/swagger";
import {UserEntity} from "../../user/entities/user.entity";
import {BadgeEntity} from "../entities/badge.entity";

export class CreateBadgeRatingDto {
    @ApiProperty()
    author: UserEntity;
    @ApiProperty()
    target: UserEntity;
    @ApiProperty()
    badge: BadgeEntity;
}