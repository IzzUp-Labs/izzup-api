import { JobStatusEntity } from "./entities/job-status.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { JobStatusService } from "./job-status.service";
import { JobStatusController } from "./job-status.controller";

@Module({
  imports: [TypeOrmModule.forFeature([JobStatusEntity])],
  controllers: [JobStatusController],
  providers: [JobStatusService],
  exports: [JobStatusService]
})
export class JobStatusModule {
}