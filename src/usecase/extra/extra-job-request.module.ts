import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtraJobRequestEntity } from "./entities/extra-job-request.entity";
import { ExtraJobRequestController } from "./extra-job-request.controller";
import { ExtraJobRequestService } from "./extra-job-request.service";
import { JobOfferModule } from "../job-offer/job-offer.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import { ExtraModule } from "./extra.module";

@Module({
  imports: [TypeOrmModule.forFeature([ExtraJobRequestEntity]), JobOfferModule, ParamCheckModule, ExtraModule],
  controllers: [ExtraJobRequestController],
  providers: [ExtraJobRequestService],
  exports: [ExtraJobRequestService]
})
export class ExtraJobRequestModule {
}
