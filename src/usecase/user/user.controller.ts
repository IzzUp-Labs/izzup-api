import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";

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

  @Get("users/unverfied")
  getUnverifiedUsers() {
    return this.userService.getUsersByStatus(UserStatusEnum.UNVERIFIED);
  }
}
