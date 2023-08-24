import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomepageCardEntity } from "../../../../usecase/homepage-card/entities/homepage-card.entity";
import { HomepageCardSeedService } from "./homepage-card-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([HomepageCardEntity])],
  providers: [HomepageCardSeedService],
  exports: [HomepageCardSeedService]
})
export class HomepageCardSeedModule {
}
