import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { GooglePlacesController } from "./google-places.controller";
import { GooglePlacesService } from "./google-places.service";

@Module({
  imports: [HttpModule],
  controllers: [GooglePlacesController],
  providers: [GooglePlacesService],
  exports: [GooglePlacesService]
})
export class GooglePlacesModule {
}
