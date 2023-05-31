import { Module } from "@nestjs/common";
import { EmployerEntity } from "../entities/employer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployerController } from "../../application/employer/employer.controller";
import { EmployerService } from "../../domain/services/employer/employer.service";
import { CompanyModule } from "./company.module";
import { JobOfferModule } from "./job-offer.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployerEntity]),
    CompanyModule,
    JobOfferModule
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService]
})
export class EmployerModule {
}