import { PartialType } from "@nestjs/swagger";
import { ActivitySectorDto } from "./activity-sector.dto";

export class UpdateActivitySectorDto extends PartialType(ActivitySectorDto) {
}