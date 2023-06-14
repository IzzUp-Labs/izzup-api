import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { JobOfferService } from "../../domain/services/job-offer/job-offer.service";
import { JobOfferDto } from "./dto/job-offer.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Job Offers')
@Controller({
  path: "job-offer",
  version: "1"
})
export class JobOfferController {
  constructor(private readonly jobOfferService: JobOfferService) {
  }
  @Get()
  findAll() {
    return this.jobOfferService.findAll();
  }

  @Get("available")
  findAllAvailable() {
    return this.jobOfferService.findAllAvailable();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobOfferService.findOne({ id: +id });
  }

  @Patch(":id")
  update(id: string, @Body() jobOfferDto: JobOfferDto) {
    return this.jobOfferService.update(+id, jobOfferDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.jobOfferService.remove(+id);
  }

}