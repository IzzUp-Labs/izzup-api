import { PartialType } from "@nestjs/mapped-types";
import { EmployerDto } from "./employer.dto";

export class UpdateEmployerDto extends PartialType(EmployerDto) {
}