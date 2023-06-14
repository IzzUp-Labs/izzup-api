import { CompanyDto } from "../../company/dto/company.dto";
import {ApiProperty} from "@nestjs/swagger";

export class AuthRegisterEmployerDto {
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
  @ApiProperty({type: CompanyDto})
  company: CompanyDto;
}