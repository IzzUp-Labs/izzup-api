import { HomepageCardTypeEnum } from "../../../domain/utils/enums/homepage-card-type.enum";

export class HomepageCardDto{
  title: string;
  description: string;
  photo: string | null;
  type: HomepageCardTypeEnum;
  link: string | null;
  company_id: number | null;
}