import {Inject, Injectable} from '@nestjs/common';
import {CreateLocationDto} from './dto/create-location.dto';
import {UpdateLocationDto} from './dto/update-location.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {Repository} from "typeorm";
import {EntityCondition} from "../../domain/utils/types/entity-condition.type";
import {JobOfferService} from '../job-offer/job-offer.service';
import {isInsideCircle} from 'geofencer'
import {CheckJobOffersInRangeDto} from "./dto/check-job-offers-in-range.dto";

@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>,
    @Inject(JobOfferService)
    private jobOfferService: JobOfferService
  ) {}
  create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.save(
        this.locationRepository.create(createLocationDto)
    )
  }

  findAll() {
    return this.locationRepository.find({
        relations: ["company", "company.jobOffers"]
    });
  }

  findOne(fields: EntityCondition<LocationEntity>) {
    return this.locationRepository.findOne({
        where: fields
    });
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return this.locationRepository.save(
        this.locationRepository.create({
            id,
            ...updateLocationDto
        }),
    )
  }

  remove(id: number) {
    return this.locationRepository.delete(id);
  }

  async findJobOffersInArea(checkJobOffersInRangeDto: CheckJobOffersInRangeDto){
    const circle = {
        center: [checkJobOffersInRangeDto.latitude, checkJobOffersInRangeDto.longitude],
        radius: 10000 // 10km
    }
    const locationOfferAvailable = await this.locationRepository.createQueryBuilder("location")
        .leftJoinAndSelect("location.company", "company")
        .leftJoinAndSelect("company.jobOffers", "jobOffer")
        .where("jobOffer.is_available = :isAvailable", {isAvailable: true})
        //.andWhere(isInsideCircle(circle.center, ["location.latitude", "location.longitude"], circle.radius))
        .getMany();

    // Check if the job offer is in the circle
    return locationOfferAvailable.filter(location => {
      return isInsideCircle(circle.center, [location.latitude, location.longitude], circle.radius);
    });
  }
}

