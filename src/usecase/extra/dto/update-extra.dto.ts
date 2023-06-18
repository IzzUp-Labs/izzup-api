import { PartialType } from "@nestjs/swagger";
import { ExtraDto } from "./extra.dto";

export class UpdateExtraDto extends PartialType(ExtraDto) {
}