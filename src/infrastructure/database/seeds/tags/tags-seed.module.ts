import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "../../../../usecase/tag/entities/tag.entity";
import { TagsSeedService } from "./tags-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagsSeedService],
  exports: [TagsSeedService]
})
export class TagsSeedModule {
}
