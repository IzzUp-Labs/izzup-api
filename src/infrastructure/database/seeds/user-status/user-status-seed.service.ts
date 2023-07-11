import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserStatusEntity } from "../../../../usecase/user-status/entities/user-status.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserStatusSeedService {
  constructor(
    @InjectRepository(UserStatusEntity)
    private repository: Repository<UserStatusEntity>
  ) {
  }

  async run() {
    await this.createStatus("UNVERIFIED");
    await this.createStatus("VERIFIED");
  }

  private async createStatus(name: string) {
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
