import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobOfferEntity } from "./entities/job-offer.entity";
import { JobOfferController } from "./job-offer.controller";
import { JobOfferService } from "./job-offer.service";

@Module({
  imports: [TypeOrmModule.forFeature([JobOfferEntity])],
  controllers: [JobOfferController],
  providers: [JobOfferService],
  exports: [JobOfferService]
})
export class JobOfferModule {
}