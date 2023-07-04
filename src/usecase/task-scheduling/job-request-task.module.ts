import { Module } from "@nestjs/common";
import { JobRequestTaskService } from "./job-request-task.service";

@Module({
  providers: [JobRequestTaskService],
  exports: [JobRequestTaskService]
})
export class JobRequestTaskModule {}