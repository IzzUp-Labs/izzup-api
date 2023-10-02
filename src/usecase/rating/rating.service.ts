import {HttpException, Injectable} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {RatingEntity} from "./entities/rating.entity";
import {Repository} from "typeorm";
import {BadgeEntity} from "./entities/badge.entity";
import {UserService} from "../user/user.service";
import {BadgeRatingEntity} from "./entities/badge-rating.entity";
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";
import {ConfigService} from "@nestjs/config";
import {FileExtensionChecker} from "../../domain/utils/file-extension-checker/file-extension-checker";
import {CreateBadgeDto} from "./dto/create-badge.dto";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private ratingRepository: Repository<RatingEntity>,
    @InjectRepository(BadgeEntity)
    private badgeRepository: Repository<BadgeEntity>,
    @InjectRepository(BadgeRatingEntity)
    private badgeRatingRepository: Repository<BadgeRatingEntity>,
    private readonly userService: UserService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly configService: ConfigService,
    private readonly fileExtensionChecker: FileExtensionChecker
  ) {}

  async rateUser(userId: string, createRatingDto: CreateRatingDto) {
    const user = await this.userService.findOne({id: userId});
    const target = await this.userService.findOne({id: createRatingDto.target_id});
    if(userId === createRatingDto.target_id){
      throw new Error("You can't rate yourself");
    }
    if(createRatingDto.stars === undefined && createRatingDto.badges === undefined){
        throw new Error("You must provide at least one of stars or badges");
    }
    if(createRatingDto.stars){
        if(createRatingDto.stars < 0 || createRatingDto.stars > 5){
            throw new Error("Stars must be between 0 and 5");
        }
        return this.ratingRepository.save({
            author: user,
            target: target,
            stars: createRatingDto.stars
        })
    }
    if (createRatingDto.badges) {
        for (const badge of createRatingDto.badges) {
            const badgeEntity = await this.badgeRepository.createQueryBuilder("badge")
                .where("badge.id = :id", {id: badge})
                .getOne();
            await this.badgeRatingRepository.save({
                author: user,
                target: target,
                badge: badgeEntity
            });
        }
    }
  }

  async findAllBadges() {
      return this.badgeRepository.find();
  }

  async createBadgeRating(createBadgeDto: CreateBadgeDto, file: Express.Multer.File) {
      return this.badgeRepository.save(
            this.badgeRepository.create(createBadgeDto)
      ).then(async (badge) => {
          if (file) {
              await this.updateBadgeIcon(badge.id, file);
          }
      });
  }

  async findUserRatingStats(userId: string) {
      return "TODO"
  }

  async findAllUserBadge(userId: string) {
      const user = await this.userService.findOne({id: userId});
      return this.badgeRepository.createQueryBuilder("badge")
          .where("badge.is_extra = :is_extra", {is_extra: !!user.extra})
          .getMany();
  }

  async updateBadgeIcon(id: string, file: Express.Multer.File) {
      const fileExtension = file.originalname.split(".").pop();
      if (!this.fileExtensionChecker.check(fileExtension)) {
          throw new HttpException("Invalid file extension", 400);
      }
      const bucket = this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
          .file(this.configService.get("firebase.badge_bucket_name") + id + "." + fileExtension);

      const blobStream = bucket.createWriteStream({
          resumable: false
      });
      blobStream.on("error", () => {
          return new HttpException("Something went wrong with the upload", 500);
      });
      blobStream.on("finish", () => {
          bucket.getSignedUrl({
              action: "read",
              expires: "03-09-2491"
          }).then(signedUrls => {
              this.badgeRepository.createQueryBuilder()
                  .where("id = :id", { id: id })
                  .update(BadgeEntity)
                  .set({ image: signedUrls[0] })
                  .execute();
          });
      });
      blobStream.end(file.buffer);
  }
}
