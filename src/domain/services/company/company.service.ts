import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EntityCondition } from "../../utils/types/entity-condition.type";
import { CompanyEntity } from "../../../infrastructure/entities/company.entity";
import { CompanyDto } from "../../../application/company/dto/company.dto";
import { UpdateCompanyDto } from "../../../application/company/dto/update-company.dto";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>
  ) {
  }

  create(companyDto: CompanyDto) {
    return this.companyRepository.save(
      this.companyRepository.create(companyDto)
    );
  }

  findAll() {
    return this.companyRepository.find(
      {
        relations: {
          sectors: true
        }
      }
    );
  }

  findOne(fields: EntityCondition<CompanyEntity>) {
    return this.companyRepository.findOne({
      where: fields
    });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return this.companyRepository.save(
      this.companyRepository.create({
        id,
        ...updateCompanyDto
      })
    );
  }

  remove(id: number) {
    return this.companyRepository.delete(id);
  }

  addActivitySector(companyId: number, activitySectorId: number) {
    try{
    return this.companyRepository
      .createQueryBuilder()
      .relation(CompanyEntity, "sectors")
      .of(companyId)
      .add(activitySectorId);
    }
    catch(error){
      console.log("Activity sector not found");
    }
  }

  removeActivitySector(companyId: number, activitySectorId: number) {
    try{
    return this.companyRepository
      .createQueryBuilder()
      .relation(CompanyEntity, "sectors")
      .of(companyId)
      .remove(activitySectorId);
    }
    catch(error){
      console.log("Activity sector not found");
    }
  }
}