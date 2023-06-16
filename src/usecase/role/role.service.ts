import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "./entities/role.entity";
import { RoleDto } from "./dto/role.dto";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  create(roleDto: RoleDto) {
    return this.roleRepository.save(
      this.roleRepository.create(roleDto),
    );
  }

  findOne(fields: EntityCondition<RoleEntity>) {
    return this.roleRepository.findOne({
      where: fields,
    });
  }

  findAll() {
    return this.roleRepository.find();
  }

  delete(id: number) {
    return this.roleRepository.delete(id);
  }

}