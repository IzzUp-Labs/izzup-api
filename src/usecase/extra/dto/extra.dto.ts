import {ApiProperty} from "@nestjs/swagger";

export class ExtraDto {
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  address: string;
}