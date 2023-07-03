import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile, Headers, HttpException
} from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParamCheckService } from "../../domain/middleware/param-check/param-check.service";

@ApiTags('User')
@Controller({
  path: "user",
  version: "1"
})
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly paramCheckService: ParamCheckService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne({ id: +id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get("users/unverified")
  getUnverifiedUsers() {
    return this.userService.getUsersByStatus(UserStatusEnum.UNVERIFIED);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id/verify")
  verifyUser(@Param("id") id: string) {
    return this.userService.verifyUser(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/photo')
  uploadFile(@UploadedFile() file: Express.Multer.File, @Headers("Authorization") authorization: string) {
    if(file === undefined) {
      throw new HttpException("Photo not provided", 400);
    }
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.uploadFile(userId, file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/id_photo')
  uploadId(@UploadedFile() file: Express.Multer.File, @Headers("Authorization") authorization: string) {
    if(file === undefined) {
      throw new HttpException("Id photo not provided", 400);
    }
    const userId = this.paramCheckService.decodeId(authorization);
    return this.userService.uploadId(userId, file);
  }
}
