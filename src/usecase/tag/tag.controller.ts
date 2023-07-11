import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { TagService } from "./tag.service";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagDto } from "./dto/tag.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";

@ApiTags("Tags")
@Controller({
  path: "tag",
  version: "1"
})
export class TagController {
  constructor(private readonly tagService: TagService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() tagDto: TagDto) {
    return this.tagService.create(tagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tagService.findOne({ id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tagService.remove(id);
  }
}
