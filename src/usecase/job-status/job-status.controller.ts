import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JobStatusService } from "./job-status.service";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";
import { JobStatusDto } from "./dto/job-status.dto";
import { UpdateJobStatusDto } from "./dto/update-job-status.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Job Status")
@Controller({
  path: "job-status",
  version: "1"
})
export class JobStatusController {
  constructor(private readonly jobStatusService: JobStatusService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() jobStatusDto: JobStatusDto) {
    return this.jobStatusService.create(jobStatusDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.jobStatusService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get(":jobStatusId")
  findOne(@Param("jobStatusId") jobStatusId: string) {
    return this.jobStatusService.findOne({ id: jobStatusId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":jobStatusId")
  update(@Param("jobStatusId") jobStatusId: string, @Body() updatedJobStatus: UpdateJobStatusDto) {
    return this.jobStatusService.update(jobStatusId, updatedJobStatus);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":jobStatusId")
  remove(@Param("jobStatusId") jobStatusId: string) {
    return this.jobStatusService.remove(jobStatusId);
  }
}
