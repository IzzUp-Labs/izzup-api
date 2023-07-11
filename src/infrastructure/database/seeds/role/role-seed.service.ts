import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../../../../usecase/role/entities/role.entity";

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>
  ) {
  }

  async run() {
    await this.createRole("Admin");
    await this.createRole("Employer");
    await this.createRole("Extra");
  }

  private async createRole(name: string) {
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
