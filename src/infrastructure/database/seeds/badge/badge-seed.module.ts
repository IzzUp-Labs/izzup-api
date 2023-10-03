import { Module } from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BadgeEntity} from "../../../../usecase/rating/entities/badge.entity";
import {BadgeSeedService} from "./badge-seed.service";
import {BadgeRatingEntity} from "../../../../usecase/rating/entities/badge-rating.entity";
import {RatingEntity} from "../../../../usecase/rating/entities/rating.entity";

@Module({
    imports: [TypeOrmModule.forFeature([BadgeEntity]),
        TypeOrmModule.forFeature([BadgeRatingEntity]),
        TypeOrmModule.forFeature([RatingEntity])
    ],
    providers: [BadgeSeedService],
    exports: [BadgeSeedService]
})
export class BadgeSeedModule {
}
