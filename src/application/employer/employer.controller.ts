import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { EmployerService } from "../../domain/services/employer/employer.service";
import { UpdateEmployerDto } from "./dto/update-employer.dto";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";

@Controller({
  path: "employer",
  version: "1"
})
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {
  }

  @Get()
  findAll() {
    return this.employerService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employerService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEmployerDto: UpdateEmployerDto) {
    return this.employerService.update(+id, updateEmployerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employerService.remove(+id);
  }


  @RoleGuard(RoleEnum.EMPLOYER)
  @UseGuards(AuthGuard('jwt'))
  @Post(":id/job-offer")
  createJobOffer(@Param("id") id: string, @Body() jobOfferDto) {
    return this.employerService.createJobOffer(+id, jobOfferDto);
  }
}
