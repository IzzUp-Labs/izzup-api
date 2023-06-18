import { PartialType } from "@nestjs/swagger";
import { ExtraDto } from "../../extra/dto/extra.dto";

export class UpdateTagDto extends PartialType(ExtraDto) {}