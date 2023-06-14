import {ApiProperty} from "@nestjs/swagger";

export class AuthMembershipCheckDto {
  @ApiProperty()
  email: string;
}