import {ApiProperty} from "@nestjs/swagger";

export class EmployerDto {
  @ApiProperty()
  user_id: number;
  @ApiProperty({type: Date})
  date_of_birth: Date;
}