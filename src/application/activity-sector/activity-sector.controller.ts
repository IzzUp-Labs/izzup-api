import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ActivitySectorService } from "../../domain/services/activity-sector/activity-sector.service";
import { UpdateActivitySectorDto } from "./dto/update-activity-sector.dto";
import { ActivitySectorDto } from "./dto/activity-sector.dto";

@Controller({
  path: "activity-sector",
  version: "1"
})
export class ActivitySectorController {
  constructor(private readonly activitySectorService: ActivitySectorService) {
  }

  @Post()
  create(@Body() activitySectorDto: ActivitySectorDto) {
    return this.activitySectorService.create(activitySectorDto);
  }

  @Get()
  findAll() {
    return this.activitySectorService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.activitySectorService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateActivitySectorDto: UpdateActivitySectorDto) {
    return this.activitySectorService.update(+id, updateActivitySectorDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.activitySectorService.remove(+id);
  }
}
