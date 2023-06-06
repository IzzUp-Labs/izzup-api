import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtraEntity } from "../entities/extra.entity";
import { ExtraController } from "../../application/extra/extra.contoller";
import { ExtraService } from "../../domain/services/extra/extra.service";
import { ExtraJobRequestEntity } from "../entities/extra-job-request.entity";
import { ExtraJobRequestController } from "../../application/extra/extra-job-request.controller";
import { ExtraJobRequestService } from "../../domain/services/extra/extra-job-request.service";
import { JobOfferModule } from "./job-offer.module";
import { ParamCheckModule } from "./param-check.module";

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEntity, ExtraJobRequestEntity]), JobOfferModule, ParamCheckModule],
  controllers: [ExtraController, ExtraJobRequestController],
  providers: [ExtraService, ExtraJobRequestService],
  exports: [ExtraService, ExtraJobRequestService]
})
export class ExtraModule {
}
