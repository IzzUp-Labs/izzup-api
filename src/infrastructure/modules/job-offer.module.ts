import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobOfferEntity } from "../entities/job-offer.entity";
import { JobOfferController } from "../../application/job-offer/job-offer.controller";
import { JobOfferService } from "../../domain/services/job-offer/job-offer.service";

@Module({
  imports: [TypeOrmModule.forFeature([JobOfferEntity])],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService]
})
export class JobOfferModule {
}