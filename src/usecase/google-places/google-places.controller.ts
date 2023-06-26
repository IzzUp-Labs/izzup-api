import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {GooglePlacesService} from "./google-places.service";
import {ApiBearerAuth} from "@nestjs/swagger";
import {AuthGuard} from "@nestjs/passport";

@Controller({
  path: "google-places",
  version: "1"
})
export class GooglePlacesController {
  constructor(private readonly googlePlacesService: GooglePlacesService) {
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("search/:nameOrAddress")
  findPlaceFromText(@Param("nameOrAddress") nameOrAddress: string){
    return this.googlePlacesService.findPlaceFromText(nameOrAddress);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get("details/:placeId")
  getPlaceDetails(@Param("placeId") placeId: string){
    return this.googlePlacesService.getPlaceDetails(placeId);
  }
}
