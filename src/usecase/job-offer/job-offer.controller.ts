import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from "@nestjs/common";
import {JobOfferService} from "./job-offer.service";
import {JobOfferDto} from "./dto/job-offer.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";

@ApiTags('Job Offers')
@Controller({
  path: "job-offer",
  version: "1"
})
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.jobOfferService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.ADMIN, RoleEnum.EXTRA])
  @Get("available")
  findAllAvailable() {
    return this.jobOfferService.findAllAvailable();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobOfferService.findOne({ id: +id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Patch(":id")
  update(id: string, @Body() jobOfferDto: JobOfferDto) {
    return this.jobOfferService.update(+id, jobOfferDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobOfferService.remove(+id);
  }

}