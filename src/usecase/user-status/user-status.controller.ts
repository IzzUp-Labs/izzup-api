import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UserStatusService } from './user-status.service';
import { CreateUserStatusDto } from './dto/create-user-status.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("User Status")
@Controller({
  path: 'user-status',
  version: '1'
})
export class UserStatusController {
  constructor(private readonly userStatusService: UserStatusService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Post()
  create(@Body() createUserStatusDto: CreateUserStatusDto) {
    return this.userStatusService.create(createUserStatusDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.userStatusService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userStatusService.findOne( { id: +id} );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
    return this.userStatusService.update(+id, updateUserStatusDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userStatusService.remove(+id);
  }
}
