import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ExtraService } from "../../domain/services/extra/extra.service";
import { UpdateExtraDto } from "./dto/update-extra.dto";
import { TagDto } from "../tag/dto/tag.dto";

@Controller({
  path: "extra",
  version: "1"
})
export class ExtraController {
  constructor(private readonly extraService: ExtraService) {
  }

  @Get()
  findAll() {
    return this.extraService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.extraService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateExtraDto: UpdateExtraDto) {
    return this.extraService.update(+id, updateExtraDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.extraService.remove(+id);
  }

  @Patch(":id/tag/:tagId")
  addTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.extraService.addTag(+id, +tagId);
  }

  @Patch(":id/add/tags")
  addTags(@Param("id") id: string, @Body() tags: TagDto[]) {
    return this.extraService.addTags({id: +id}, tags);
  }

  @Delete(":id/tag/:tagId")
  removeTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.extraService.removeTag(+id, +tagId);
  }
}
