import {ApiProperty} from "@nestjs/swagger";

export class JobStatusDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  status: string;
}