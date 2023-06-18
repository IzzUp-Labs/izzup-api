import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserStatusEntity } from "../../../../usecase/user-status/entities/user-status.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserStatusSeedService {
  constructor(
    @InjectRepository(UserStatusEntity)
    private repository: Repository<UserStatusEntity>,
  ) {}

  async run() {
    await this.createStatus(1, 'UNVERIFIED');
    await this.createStatus(2, 'VERIFIED');
  }

  private async createStatus(id: number, name: string) {
    const count = await this.repository.count({
      where: {
        id : id,
      },
    })

    if (count === 0) {
      await this.repository.save(
        this.repository.create({
          id: id,
          name,
        }),
      );
    }
  }
}