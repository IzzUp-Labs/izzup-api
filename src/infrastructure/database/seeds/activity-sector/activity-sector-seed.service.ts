import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ActivitySectorEntity } from "../../../../usecase/activity-sector/entities/activity-sector.entity";
import { Repository } from "typeorm";

@Injectable()
export class ActivitySectorSeedService {
  constructor(
    @InjectRepository(ActivitySectorEntity)
    private repository: Repository<ActivitySectorEntity>
  ) {
  }

  async run() {
    await this.createActivitySector("Restauration");
    await this.createActivitySector("Hôtellerie");
    await this.createActivitySector("Evénementiel");
    await this.createActivitySector("Tourisme");
    await this.createActivitySector("Autres");
  }

  private async createActivitySector(name: string) {
    const count = await this.repository.count({
      where: {
        name: name
      }
    });

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          name
        })
      );
    }
  }
}
