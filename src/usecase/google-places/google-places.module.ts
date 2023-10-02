import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { GooglePlacesController } from "./google-places.controller";
import { GooglePlacesService } from "./google-places.service";
import {CompanyModule} from "../company/company.module";

@Module({
  imports: [HttpModule, CompanyModule],
  controllers: [GooglePlacesController],
  providers: [GooglePlacesService],
  exports: [GooglePlacesService]
})
export class GooglePlacesModule {
}
