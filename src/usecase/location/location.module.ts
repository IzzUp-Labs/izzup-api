import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {JobOfferModule} from "../job-offer/job-offer.module";

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), JobOfferModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService]
})
export class LocationModule {}
