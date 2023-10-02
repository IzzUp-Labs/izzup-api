import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RatingEntity} from "./entities/rating.entity";
import {BadgeEntity} from "./entities/badge.entity";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";
import {UserModule} from "../user/user.module";
import {BadgeRatingEntity} from "./entities/badge-rating.entity";
import {FileExtensionChecker} from "../../domain/utils/file-extension-checker/file-extension-checker";

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]),
    TypeOrmModule.forFeature([BadgeEntity]),
    TypeOrmModule.forFeature([BadgeRatingEntity]),
    ParamCheckModule,
    UserModule
  ],
  controllers: [RatingController],
  providers: [RatingService, FileExtensionChecker]
})
export class RatingModule {}
