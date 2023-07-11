import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
