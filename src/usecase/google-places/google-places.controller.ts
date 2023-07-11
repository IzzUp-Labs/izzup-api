import { Controller, Get, Param } from "@nestjs/common";
import { GooglePlacesService } from "./google-places.service";

@Controller({
  path: "google-places",
  version: "1"
})
export class GooglePlacesController {
  constructor(private readonly googlePlacesService: GooglePlacesService) {
  }

  @Get("search/:nameOrAddress")
  findPlaceFromText(@Param("nameOrAddress") nameOrAddress: string) {
    return this.googlePlacesService.findPlaceFromText(nameOrAddress);
  }

  @Get("details/:placeId")
  getPlaceDetails(@Param("placeId") placeId: string) {
    return this.googlePlacesService.getPlaceDetails(placeId);
  }
}
