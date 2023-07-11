import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleDto } from "./dto/role.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";

@ApiTags("Roles")
@Controller({
  path: "role",
  version: "1"
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() roleDto: RoleDto) {
    return this.roleService.create(roleDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get(":name")
  findOne(@Param("name") name: string) {
    return this.roleService.findOne({ name: name });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.roleService.delete(id);
  }
}
