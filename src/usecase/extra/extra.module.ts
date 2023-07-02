import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtraEntity } from "./entities/extra.entity";
import { ExtraController } from "./extra.contoller";
import { ExtraService } from "./extra.service";
import { JobOfferModule } from "../job-offer/job-offer.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import {ExtraJobRequestModule} from "./extra-job-request.module";

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEntity]),
    JobOfferModule,
    ParamCheckModule,
    ExtraJobRequestModule
  ],
  controllers: [ExtraController],
  providers: [ExtraService],
  exports: [ExtraService]
})
export class ExtraModule {
}
