import { JobStatusDto } from "./job-status.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateJobStatusDto extends PartialType(JobStatusDto) {
}