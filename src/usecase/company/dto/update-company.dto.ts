import { PartialType } from "@nestjs/swagger";
import { CompanyDto } from "./company.dto";

export class UpdateCompanyDto extends PartialType(CompanyDto) {
}