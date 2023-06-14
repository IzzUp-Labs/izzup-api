import {Body, Controller, Delete, Get, Param, Patch} from "@nestjs/common";
import { CompanyService } from "../../domain/services/company/company.service";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Companies')
@Controller({
  path: "company",
  version: "1"
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companyService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.companyService.remove(+id);
  }

  @Patch(":id/activity-sector/:activitySectorId")
  addActivitySector(@Param("id") id: string, @Param("activitySectorId") activitySectorId: string) {
    return this.companyService.addActivitySector(+id, +activitySectorId);
  }

  @Delete(":id/activity-sector/:activitySectorId")
  removeActivitySector(@Param("id") id: string, @Param("activitySectorId") activitySectorId: string) {
    return this.companyService.removeActivitySector(+id, +activitySectorId);
  }
}
