import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomepageCardEntity } from "./entities/homepage-card.entity";
import { HomepageCardController } from "./homepage-card.controller";
import { HomepageCardService } from "./homepage-card.service";

@Module({
  imports: [TypeOrmModule.forFeature([HomepageCardEntity])],
  controllers: [HomepageCardController],
  providers: [HomepageCardService],
  exports: [HomepageCardService]
})
export class HomepageCardModule {
}
