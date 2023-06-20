import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";

@ApiTags('User')
@Controller({
  path: "user",
  version: "1"
})
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt'))
  //@RoleGuard(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Get("users/unverified")
  getUnverifiedUsers() {
    return this.userService.getUsersByStatus(UserStatusEnum.UNVERIFIED);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Patch(":id/verify")
  verifyUser(@Param("id") id: string) {
    return this.userService.verifyUser(+id);
  }
}
