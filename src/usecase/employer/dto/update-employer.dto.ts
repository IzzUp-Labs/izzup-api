import { PartialType } from "@nestjs/swagger";
import { EmployerDto } from "./employer.dto";

export class UpdateEmployerDto extends PartialType(EmployerDto) {
}