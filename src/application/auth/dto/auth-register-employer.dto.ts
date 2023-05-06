import { CompanyDto } from "../../company/dto/company.dto";

export class AuthRegisterEmployerDto {
  email: string;
  password: string;
  last_name: string;
  first_name: string;
  date_of_birth: Date;
  company: CompanyDto;
}