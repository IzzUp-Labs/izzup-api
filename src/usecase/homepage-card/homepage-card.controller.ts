import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { HomepageCardService } from "./homepage-card.service";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags('Homepage Cards')
@Controller( {
  path: 'homepage-card',
  version: '1'
})
export class HomepageCardController {
  constructor(
    private readonly homepageCardService: HomepageCardService
  ) {
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() homepageCardDto) {
    return this.homepageCardService.create(homepageCardDto);
  }

  @Get()
  findAll() {
    return this.homepageCardService.findAll();
  }

  @Get(":id")
  findOne(@Body() homepageCardDto) {
    return this.homepageCardService.findOne(homepageCardDto);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Patch(":id")
  update(@Param("id") id: number ,@Body() homepageCardDto) {
    return this.homepageCardService.update(id, homepageCardDto);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.homepageCardService.remove(id);
  }


}