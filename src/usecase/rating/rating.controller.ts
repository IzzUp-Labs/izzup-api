import {Controller, Get, Post, Body, UseGuards, Headers, UploadedFile, UseInterceptors} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateBadgeDto} from "./dto/create-badge.dto";

@ApiTags("Rating")
@Controller({
    path: 'rating',
    version: '1'
})
export class RatingController {
  constructor(
      private readonly ratingService: RatingService,
      private readonly paramCheckService: ParamCheckService
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post('rate-user')
  rateUser(@Body() createRatingDto: CreateRatingDto, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.ratingService.rateUser(userId, createRatingDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @UseInterceptors(FileInterceptor("file"))
  @Post('add-badge')
  createBadgeRating(@Body() createBadgeDto: CreateBadgeDto, @UploadedFile() file: Express.Multer.File) {
    return this.ratingService.createBadgeRating(createBadgeDto, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get('user-stats')
  findUserRatingStats(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.ratingService.findUserRatingStats(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get('user-badges')
  findAllUserBadge(@Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.ratingService.findAllUserBadge(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get('badges')
  findAllBadges() {
    return this.ratingService.findAllBadges();
  }
}
