import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../../../entities/role.entity";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    await this.createRole(1, 'Admin');
    await this.createRole(2, 'Employer');
    await this.createRole(3, 'Extra');
  }

  private async createRole(id: number, name: string) {
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
