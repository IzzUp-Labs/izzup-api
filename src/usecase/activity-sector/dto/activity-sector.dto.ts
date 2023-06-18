import {ApiProperty} from "@nestjs/swagger";

export class ActivitySectorDto {
  @ApiProperty({required: false})
  id?: number;
  @ApiProperty()
  name: string;
}