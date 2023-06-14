import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TagService } from "../../domain/services/tag/tag.service";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagDto } from "./dto/tag.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Tags')
@Controller({
  path: 'tag',
  version: '1',
})
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() tagDto: TagDto) {
    return this.tagService.create(tagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
