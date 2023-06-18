import {ApiProperty} from "@nestjs/swagger";

export class ExtraDto {
  @ApiProperty()
  address: string;
}