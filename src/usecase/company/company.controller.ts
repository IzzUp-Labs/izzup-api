import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";

@ApiTags("Companies")
@Controller({
  path: "company",
  version: "1"
})
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companyService.findOne({ id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.companyService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Patch(":id/activity-sector/:activitySectorId")
  addActivitySector(@Param("id") id: string, @Param("activitySectorId") activitySectorId: string) {
    return this.companyService.addActivitySector(id, activitySectorId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.EMPLOYER, RoleEnum.ADMIN])
  @Delete(":id/activity-sector/:activitySectorId")
  removeActivitySector(@Param("id") id: string, @Param("activitySectorId") activitySectorId: string) {
    return this.companyService.removeActivitySector(id, activitySectorId);
  }
}
