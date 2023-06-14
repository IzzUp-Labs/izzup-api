import {ApiProperty} from "@nestjs/swagger";

export class ExtraDto {
  @ApiProperty()
  user_id: number;
  @ApiProperty({type: Date})
  date_of_birth: Date;
  @ApiProperty()
  address: string;
}