import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { IdPhotoService } from "../../domain/services/extra/id-photo.service";
import { IdPhotoDto } from "./dto/id-photo.dto";

@Controller({
  path: "id-photo",
  version: "1"
  })
export class IdPhotoController {
  constructor(private readonly idPhotoService: IdPhotoService) {
  }

  @Post()
  create(@Body() idPhotoDto: IdPhotoDto) {
    return this.idPhotoService.create(idPhotoDto);
  }

  @Get()
  findAll() {
    return this.idPhotoService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.idPhotoService.findOne({ id: +id });
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.idPhotoService.remove(+id);
  }
}