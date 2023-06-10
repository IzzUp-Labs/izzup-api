import { JobStatusEntity } from "../entities/job-status.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { JobStatusService } from "../../domain/services/job-status/job-status.service";
import { JobStatusController } from "../../application/job-status/job-status.controller";

@Module({
  imports: [TypeOrmModule.forFeature([JobStatusEntity])],
  controllers: [JobStatusController],
  providers: [JobStatusService],
  exports: [JobStatusService]
})
export class JobStatusModule {
}