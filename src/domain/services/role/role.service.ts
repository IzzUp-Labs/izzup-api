import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoleEntity } from "../../../infrastructure/entities/role.entity";
import { RoleDto } from "../../../application/role/dto/role.dto";
import { EntityCondition } from "../../utils/types/entity-condition.type";

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

}