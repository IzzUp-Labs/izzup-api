import {ApiProperty} from "@nestjs/swagger";

export class TagDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
}