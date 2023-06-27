import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ActivitySectorService } from "./activity-sector.service";
import { UpdateActivitySectorDto } from "./dto/update-activity-sector.dto";
import { ActivitySectorDto } from "./dto/activity-sector.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Activity Sectors')
@Controller({
  path: "activity-sector",
  version: "1"
})
export class ActivitySectorController {
  constructor(private readonly activitySectorService: ActivitySectorService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() activitySectorDto: ActivitySectorDto) {
    return this.activitySectorService.create(activitySectorDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.activitySectorService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.activitySectorService.findOne({ id: +id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateActivitySectorDto: UpdateActivitySectorDto) {
    return this.activitySectorService.update(+id, updateActivitySectorDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.activitySectorService.remove(+id);
  }
}
