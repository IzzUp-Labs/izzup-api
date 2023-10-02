import { Module } from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BadgeEntity} from "../../../../usecase/rating/entities/badge.entity";
import {BadgeSeedService} from "./badge-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([BadgeEntity])],
    providers: [BadgeSeedService],
    exports: [BadgeSeedService]
})
export class BadgeSeedModule {
}
