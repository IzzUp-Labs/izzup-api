import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomepageCardEntity } from "../entities/homepage-card.entity";
import { HomepageCardController } from "../../application/homepage-card/homepage-card.controller";
import { HomepageCardService } from "../../domain/services/homepage-card/homepage-card.service";

@Module({
  imports: [TypeOrmModule.forFeature([HomepageCardEntity])],
  controllers: [HomepageCardController],
  providers: [HomepageCardService],
  exports: [HomepageCardService]
})
export class HomepageCardModule {
}
