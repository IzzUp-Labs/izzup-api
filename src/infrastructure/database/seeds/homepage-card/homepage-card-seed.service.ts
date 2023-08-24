import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HomepageCardEntity } from "../../../../usecase/homepage-card/entities/homepage-card.entity";
import { Repository } from "typeorm";

@Injectable()
export class HomepageCardSeedService {
  constructor(
    @InjectRepository(HomepageCardEntity)
    private repository: Repository<HomepageCardEntity>
  ) {
  }

  async run() {
    await this.createHomepageCard(
      "Bar Marls",
      "Recherche d'un Barista capable de divertire les clients.",
      "https://storage.googleapis.com/izzup-119e8.appspot.com/homepage_card/9.jpeg?GoogleAccessId=firebase-adminsdk-dx30u%40izzup-119e8.iam.gserviceaccount.com&Expires=16447017600&Signature=vU94zbUFMosoyawkcvHyMMoeL6tYk88esq7nyzRrb4Ga8pxs5xSb0wmmRTU9wwBXENppNo1uU6lFF%2Bhm4ZTNbkRLc5YxQ6sVxnOCdK7MMTCHNcXLYnznX9Pj7oJdz4XZCUbc5ZeslpJl32NRL1bWhIQyL1eVbDo6pPy5brl5sfiYoBE1eRFAEuwdPl%2FuQ2aiTi4KV536BIgB6yV4GrFDjkM%2BlQAsK6h4PzHtFVBO%2Bc0csdn18e%2BIC9%2F%2BDPX3jo01QFHbihrfhCzdhPucBhnpQ7XNslYA3A9akDSwJn4Q2vk6xBKKU6tYo5Y9l3zptjxibvVagdfVhccFk8d8om2H8g%3D%3D",
      "FOR_YOU");
    await this.createHomepageCard(
      "L'entrainement des Videurs",
      "Dans quelle mesure les videurs doivent-ils être formés pour gérer les situations difficiles.",
      "https://storage.googleapis.com/izzup-119e8.appspot.com/homepage_card/7.jpeg?GoogleAccessId=firebase-adminsdk-dx30u%40izzup-119e8.iam.gserviceaccount.com&Expires=16447017600&Signature=Q2lnVA6QhMJ3kJMbG44NaA287Em%2F0e7sJykEAHILEw3PJCLFkdWDD25Myjo9uPcLJ1ZQryt3Ow1Wp7vz0WZweGHkPAguuxfuA%2BwlakJZBMWeBOS%2Bo7B%2BgTdNcbvaTIMDSBq8Rz8fjTvPlDhD6ebLGrnk0lm3Nqch%2BKjce0o7gjRggAg9k0jPdTvTcj%2BlqVkozxUsImh5Nqw9MLcP5%2BMFS7PAgR5blmAXs0rBnvJFEatIDnDUmJk8b6bbfHWCq1WOh5OybtGei%2F0quQFq%2FBJ%2FXYzoksB2VjiWDThfXQoFFOpvfuJnHVYDK9DlHluA6Ahyt0j3LkgV0fh2hxLyAhUTuQ%3D%3D",
      "NEWS");
    await this.createHomepageCard(
      "Neon Nightclub",
      "Besoin d'un agent de sécurité qui peut garder le club en sécurité.",
      "https://storage.googleapis.com/izzup-119e8.appspot.com/homepage_card/2.jpeg?GoogleAccessId=firebase-adminsdk-dx30u%40izzup-119e8.iam.gserviceaccount.com&Expires=16447017600&Signature=KMaP9EtoOhJl2sUKifU8CHnbH9qpYfcJ%2BR5xUjpVJqybvsJbK5hloEJYyosC0nik20foipcETsi7CT%2Fs7%2FBa5RAIegiNOZd6OuDUF6TqVWKnzzq2a%2BpGCfR2xMuApTF5lYk93H%2BMCeZ140RWkQ3RhU1lTIto7gEbG9GoMsRVKJ1gBZCsIu4AaXx8dmpeOpGw7H8qTyUyJpDB0BksgdMA5hyfGgHCKSXf4K1LrleG79UYtUtC67cf%2Bsjx0MALT80eFbGNZWfpoQtxEiYgE3zjkxv2kjVR1gje4vA8d8DUY8QiU5ctRItm1jZInbTw3LL%2Fz175F74O%2BMRbwgei1YBZ4Q%3D%3D",
      "JOBS");
  }

  private async createHomepageCard(title: string, description: string, photo: string, type: string) {
    const homepageCard = new HomepageCardEntity();
    homepageCard.title = title;
    homepageCard.description = description;
    homepageCard.photo = photo;
    homepageCard.type = type;
    await this.repository.save(homepageCard);
  }
}
