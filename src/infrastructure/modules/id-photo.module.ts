import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdPhotoEntity } from "../entities/id-photo.entity";
import { IdPhotoController } from "../../application/extra/id-photo.controller";
import { IdPhotoService } from "../../domain/services/extra/id-photo.service";

@Module({
  imports: [TypeOrmModule.forFeature([IdPhotoEntity])],
  controllers: [IdPhotoController],
  providers: [IdPhotoService],
  exports: [IdPhotoService]
})
export class IdPhotoModule {
}
