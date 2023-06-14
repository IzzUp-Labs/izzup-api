import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { RoleService } from "../../domain/services/role/role.service";
import { RoleDto } from "./dto/role.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Roles')
@Controller({
  path: 'role',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() roleDto: RoleDto){
    return this.roleService.create(roleDto);
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.roleService.findOne({ name: name });
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.delete(+id);
  }
}