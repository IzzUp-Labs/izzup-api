import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExtraEntity } from "../entities/extra.entity";
import { ExtraController } from "../../application/extra/extra.contoller";
import { ExtraService } from "../../domain/services/extra/extra.service";
import { JobOfferModule } from "./job-offer.module";
import { ParamCheckModule } from "./param-check.module";

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEntity]),
    JobOfferModule, ParamCheckModule],
  controllers: [ExtraController],
  providers: [ExtraService],
  exports: [ExtraService]
})
export class ExtraModule {
}
