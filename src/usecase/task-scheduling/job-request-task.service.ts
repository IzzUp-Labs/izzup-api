import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class JobRequestTaskService {
  private readonly logger = new Logger(JobRequestTaskService.name);

  // Every minute
  @Cron(  CronExpression.EVERY_SECOND)
  handleCron() {
    this.logger.log('Called every minute')
  }
}