import {ApiProperty} from "@nestjs/swagger";

export class AuthRegisterExtraDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty({type: Date})
  date_of_birth: Date;
  @ApiProperty()
  address: string;
}