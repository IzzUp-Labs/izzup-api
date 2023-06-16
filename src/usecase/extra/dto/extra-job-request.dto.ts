import { JobRequestStatus } from "../../../domain/utils/enums/job-request-status";
import {ApiProperty} from "@nestjs/swagger";

export class ExtraJobRequestDto {
  @ApiProperty()
  extraId: number;
  @ApiProperty({type: JobRequestStatus})
  status: JobRequestStatus;
}