import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {CheckJobOffersInRangeDto} from "./dto/check-job-offers-in-range.dto";
import {ApiBearerAuth} from "@nestjs/swagger";
import {RoleGuard} from "../../domain/guards/role.decorator";
import {RoleEnum} from "../../domain/utils/enums/role.enum";
import {AuthGuard} from "@nestjs/passport";

@Controller({
    path: 'location',
    version: '1'
})
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne({id: +id});
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @ApiBearerAuth()
  @RoleGuard(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('job-offers-in-range')
  findJobOffersInArea(@Body() checkJobOffersInRangeDto: CheckJobOffersInRangeDto) {
    return this.locationService.findJobOffersInArea(checkJobOffersInRangeDto);
  }
}
