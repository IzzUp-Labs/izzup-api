import { HttpException, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import {CompanyService} from "../company/company.service";

@Injectable()
export class GooglePlacesService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private companyService: CompanyService
  ) {}

  async findPlaceFromText(nameOrAddress: string) {
    const fields = "formatted_address%2Cname%2Cplace_id%2Ctype%2Cuser_ratings_total%2Crating%2Cgeometry";
    const { data } = await firstValueFrom(
      this.httpService.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=${fields}&input=${nameOrAddress}&inputtype=textquery&key=${this.configService.get("google-api.google_api_key")}`).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException("Company not found with this address or name\n" + error, 404);
        })
      )
    );
    return data.candidates.filter(candidate => candidate.types.includes("establishment"));
  }

  async getPlaceDetails(placeId: string) {
    const fields = "place_id%2Cuser_ratings_total%2Crating%2Cgeometry%2Cformatted_phone_number%2Cformatted_address%2Cname%2Copening_hours%2Cwebsite%2Curl%2Cvicinity%2Ctypes%2Cphotos%2Cadr_address%2Cbusiness_status%2Cicon%2Cinternational_phone_number%2Cplus_code%2Cprice_level%2Creviews%2Cscope";
    const { data } = await firstValueFrom(
      this.httpService.get(`https://maps.googleapis.com/maps/api/place/details/json?fields=${fields}&place_id=${placeId}&key=${this.configService.get("google-api.google_api_key")}`).pipe(
        catchError((error: AxiosError) => {
          throw new HttpException("Company not found with this address or name\n" + error, 404);
        })
      )
    );
    return data;
  }

  async verifyPlace(placeId: string) {
      const company = await this.companyService.findOne({place_id: placeId});
      if(company){
          throw new HttpException("Company already exists", 409);
      }
  }
}
