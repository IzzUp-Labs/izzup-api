import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HomepageCardEntity } from "./entities/homepage-card.entity";
import { HomepageCardController } from "./homepage-card.controller";
import { HomepageCardService } from "./homepage-card.service";
import { FileExtensionChecker } from "../../domain/utils/file-extension-checker/file-extension-checker";

@Module({
  imports: [TypeOrmModule.forFeature([HomepageCardEntity])],
  controllers: [HomepageCardController],
  providers: [HomepageCardService, FileExtensionChecker],
  exports: [HomepageCardService]
})
export class HomepageCardModule {
}
