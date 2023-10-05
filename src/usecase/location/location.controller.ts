import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { CheckJobOffersInRangeDto } from "./dto/check-job-offers-in-range.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import { RoleGuard } from "../../domain/guards/role.decorator";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Location")
@Controller({
  path: "location",
  version: "1"
})
export class LocationController {
  constructor(private readonly locationService: LocationService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Get(":locationId")
  findOne(@Param("locationId") locationId: string) {
    return this.locationService.findOne({ id: locationId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Patch(":locationId")
  update(@Param("locationId") locationId: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(locationId, updateLocationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.ADMIN])
  @Delete(":locationId")
  remove(@Param("locationId") locationId: string) {
    return this.locationService.remove(locationId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @RoleGuard([RoleEnum.EXTRA, RoleEnum.ADMIN])
  @Post("job-offers-in-range")
  findJobOffersInArea(@Body() checkJobOffersInRangeDto: CheckJobOffersInRangeDto) {
    return this.locationService.findJobOffersInArea(checkJobOffersInRangeDto);
  }
}
