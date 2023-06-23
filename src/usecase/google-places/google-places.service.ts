import {HttpException, Injectable} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class GooglePlacesService {
  constructor(
      private readonly httpService: HttpService,
      private configService: ConfigService) {
  }

    async findPlaceFromText(nameOrAddress: string){
        const fields = 'formatted_address%2Cname%2Cplace_id%2Ctype%2Cuser_ratings_total%2Crating'
        const {data} = await firstValueFrom(
            this.httpService.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=${fields}&input=${nameOrAddress}&inputtype=textquery&key=${this.configService.get('google_api_key')}`).pipe(
                catchError((error: AxiosError) => {
                    throw new HttpException('Company not found with this address or name\n'+error, 404);
                }),
            ),
        );
        return data;
    }
}