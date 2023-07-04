import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EntityCondition} from "../../domain/utils/types/entity-condition.type";
import {ExtraEntity} from "./entities/extra.entity";
import {UpdateExtraDto} from "./dto/update-extra.dto";
import {ExtraDto} from "./dto/extra.dto";
import {JobRequestStatus} from "../../domain/utils/enums/job-request-status";

@Injectable()
export class ExtraService {
  constructor(
    @InjectRepository(ExtraEntity)
    private extrasRepository: Repository<ExtraEntity>,
  ) {}

  create(extraDto: ExtraDto) {
    return this.extrasRepository.save(
      this.extrasRepository.create(extraDto)
    );
  }

  findAll() {
    return this.extrasRepository.find({
      relations: {
        tags: true
      }
    });
  }

  findOne(fields: EntityCondition<ExtraEntity>) {
    return this.extrasRepository.findOne({
      relations: {
        tags: true,
        requests: true,
      },
      where: fields
    });
  }

  findExtraWithRequestsAndJobOffers(fields: EntityCondition<ExtraEntity>) {
    return this.extrasRepository.findOne({
      relations: ['requests', 'requests.jobOffer'],
      where: fields
    });
  }

  update(id: number, updateExtraDto: UpdateExtraDto) {
    return this.extrasRepository.save(
      this.extrasRepository.create({
        id,
        ...updateExtraDto
      })
    );
  }

  remove(id: number) {
    return this.extrasRepository.delete(id);
  }

  addTag(extraId: number, tagId: number) {
    try {
      return this.extrasRepository
        .createQueryBuilder()
        .relation(ExtraEntity, "tags")
        .of(extraId)
        .add(tagId)
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }

  async addTags(extraId: number, tagIds: number[]) {
    const extra = await this.extrasRepository.findOne({
      relations: {
        tags: true
      },
      where: {
        user: {
          id: extraId
        }
      }
    })
    try {
      return this.extrasRepository
          .createQueryBuilder()
          .relation(ExtraEntity, "tags")
          .of(extra.id)
          .addAndRemove(tagIds, extra.tags.map(tag => tag.id))
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }

  removeTag(extraId: number, tagId: number) {
    try {
      return this.extrasRepository
        .createQueryBuilder()
        .relation(ExtraEntity, "tags")
        .of(extraId)
        .remove(tagId);
    }
    catch (error) {
      throw new Error("Tag not found");
    }
  }

  async getVerificationCode(userId: number, requestId: number) {
    const extra = await this.findOne({user: {id: userId}});
    const request = extra.requests.find(request => request.id === requestId);
    if(!request) {
      throw new Error("Request not found");
    }
    if(request.status !== JobRequestStatus.WAITING_FOR_VERIFICATION) {
        throw new Error("Request is not waiting for verification");
    }
    return request.verification_code;
  }

  async getStatistics(userId: number) {
    const extra = await this.findOne({user: {id: userId}});
    const requests = extra.requests;

    const total_earned = requests.filter(request => request.status === JobRequestStatus.FINISHED)
      .map(request => request.jobOffer.price * request.jobOffer.working_hours)
      .reduce((a, b) => a + b, 0);

    return {
      total_request: requests.length,
      total_earned: total_earned,
      accepted_request: requests.filter(request => request.status === JobRequestStatus.ACCEPTED).length,
      rejected_request: requests.filter(request => request.status === JobRequestStatus.REJECTED).length,
      waiting_request: requests.filter(request => request.status === JobRequestStatus.WAITING_FOR_VERIFICATION).length,
      finished_request: requests.filter(request => request.status === JobRequestStatus.FINISHED).length,
    };
  }
}