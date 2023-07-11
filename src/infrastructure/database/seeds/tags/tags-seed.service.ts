import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "../../../../usecase/tag/entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagsSeedService {
  constructor(
    @InjectRepository(TagEntity)
    private repository: Repository<TagEntity>
  ) {
  }

  async run() {
    await this.createTag("Videur/Securité", "#0235ff");
    await this.createTag("Barista", "#a27a47");
    await this.createTag("Serveur", "#fffb00");
    await this.createTag("Plongeur", "#8fe8ff");
    await this.createTag("Cuisinier", "#67ff47");
    await this.createTag("Chef de cuisine", "#ff2424");
    await this.createTag("Commis de cuisine", "#b763ff");
    await this.createTag("Barman", "#ffffff");
    await this.createTag("Hôtesse", "#000000");
  }

  private async createTag(name: string, color: string) {
    const count = await this.repository.count({
      where: {
        name: name
      }
    });

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          name,
          color
        })
      );
    }
  }
}
