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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { HomepageCardDto } from "./dto/homepage-card.dto";

@ApiTags("Homepage Cards")
@Controller({
  path: "homepage-card",
  version: "1"
})
export class HomepageCardController {
  constructor(
    private readonly homepageCardService: HomepageCardService
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @UseInterceptors(FileInterceptor("file"))
  @Post()
  create(@Body() homepageCardDto: HomepageCardDto, @UploadedFile() file: Express.Multer.File) {
    return this.homepageCardService.create(homepageCardDto, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll() {
    return this.homepageCardService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":cardId")
  findOne(@Param("cardId") cardId: string) {
    return this.homepageCardService.findOne({ id: cardId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":cardId")
  update(@Param("cardId") cardId: string, @Body() homepageCardDto: HomepageCardDto) {
    return this.homepageCardService.update(cardId, homepageCardDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":cardId")
  remove(@Param("cardId") cardId: string) {
    return this.homepageCardService.remove(cardId);
  }
}
