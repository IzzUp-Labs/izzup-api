import { Module } from "@nestjs/common";
import { EmployerEntity } from "./entities/employer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployerController } from "./employer.controller";
import { EmployerService } from "./employer.service";
import { CompanyModule } from "../company/company.module";
import { JobOfferModule } from "../job-offer/job-offer.module";
import { ParamCheckModule } from "../../domain/middleware/param-check/param-check.module";
import { ExtraJobRequestModule } from "../extra/extra-job-request.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployerEntity]),
    CompanyModule,
    JobOfferModule,
    ParamCheckModule,
    ExtraJobRequestModule,
    NotificationModule
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService]
})
export class EmployerModule {
}
