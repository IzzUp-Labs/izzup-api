import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";
import {CheckDeviceFcmTokenDto} from "../device/dto/check-device-fcm-token.dto";

@ApiTags("User")
@Controller({
  path: "user",
  version: "1"
})
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly paramCheckService: ParamCheckService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne({ id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Patch('update-info')
  updateInfo(@Body() updateUserDto: UpdateUserDto, @Headers("Authorization") authorization: string, @UploadedFile() file: Express.Multer.File) {
    if (file === undefined) {
      throw new HttpException("Id photo not provided", 400);
    }
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.updateInfo(userId, updateUserDto, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get("users/unverified")
  getUnverifiedUsers() {
    return this.userService.getUsersByStatus(UserStatusEnum.UNVERIFIED);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id/verify")
  verifyUser(@Param("id") id: string) {
    return this.userService.verifyUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id/not-verify")
  notVerifyUser(@Param("id") id: string) {
    return this.userService.notVerifyUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  @Post("upload/photo")
  uploadFile(@UploadedFile() file: Express.Multer.File, @Headers("Authorization") authorization: string) {
    if (file === undefined) {
      throw new HttpException("Photo not provided", 400);
    }
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.uploadFile(userId, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file"))
  @Post("upload/id_photo")
  uploadId(@UploadedFile() file: Express.Multer.File, @Headers("Authorization") authorization: string) {
    if (file === undefined) {
      throw new HttpException("Id photo not provided", 400);
    }
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.uploadId(userId, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("device/check")
  checkFcmToken(@Body() checkUserFcmTokenDto: CheckDeviceFcmTokenDto, @Headers("Authorization") authorization: string) {
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.checkFCMToken(userId, checkUserFcmTokenDto.device_id, checkUserFcmTokenDto.fcm_token, checkUserFcmTokenDto.device_language);
  }
}
