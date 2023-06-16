import { PartialType } from "@nestjs/mapped-types";
import { ExtraDto } from "../../extra/dto/extra.dto";

export class UpdateTagDto extends PartialType(ExtraDto) {}