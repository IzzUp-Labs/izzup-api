import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
