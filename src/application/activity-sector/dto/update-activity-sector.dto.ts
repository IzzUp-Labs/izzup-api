import { PartialType } from "@nestjs/mapped-types";
import { ActivitySectorDto } from "./activity-sector.dto";

export class UpdateActivitySectorDto extends PartialType(ActivitySectorDto) {
}