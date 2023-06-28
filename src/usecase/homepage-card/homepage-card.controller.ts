import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { HomepageCardService } from "./homepage-card.service";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { HomepageCardDto } from "./dto/homepage-card.dto";

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
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(@Body() homepageCardDto: HomepageCardDto, @UploadedFile() file: Express.Multer.File,) {
    console.log(file);
    return this.homepageCardService.create(homepageCardDto, file);
  }

  /*@ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))*/
  @Get()
  findAll() {
    return this.homepageCardService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  findOne(@Body() homepageCardDto) {
    return this.homepageCardService.findOne(homepageCardDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id")
  update(@Param("id") id: number ,@Body() homepageCardDto) {
    return this.homepageCardService.update(id, homepageCardDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.homepageCardService.remove(id);
  }
}