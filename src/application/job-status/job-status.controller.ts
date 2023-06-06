import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JobStatusService } from "../../domain/services/job-status/job-status.service";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";
import { JobStatusDto } from "./dto/job-status.dto";
import { UpdateJobStatusDto } from "./dto/update-job-status.dto";

@Controller({
  path: "job-status",
  version: "1"
})
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Post()
  create(@Body() jobStatusDto: JobStatusDto) {
    return this.jobStatusService.create(jobStatusDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Get()
  findAll() {
    return this.jobStatusService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobStatusService.findOne({ id: +id });
  }

  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatedJobStatus: UpdateJobStatusDto) {
    return this.jobStatusService.update(+id, updatedJobStatus);
  }

  @UseGuards(AuthGuard('jwt'))
  @RoleGuard(RoleEnum.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobStatusService.remove(+id);
  }
}