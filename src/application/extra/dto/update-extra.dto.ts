import { PartialType } from "@nestjs/mapped-types";
import { ExtraDto } from "./extra.dto";

export class UpdateExtraDto extends PartialType(ExtraDto) {}