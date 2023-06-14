import { HomepageCardTypeEnum } from "../../../domain/utils/enums/homepage-card-type.enum";
import {ApiProperty} from "@nestjs/swagger";

export class HomepageCardDto{
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty({required: false})
  photo: string | null;
  @ApiProperty({type: HomepageCardTypeEnum})
  type: HomepageCardTypeEnum;
  @ApiProperty({required: false})
  link: string | null;
  @ApiProperty({required: false})
  company_id: number | null;
}