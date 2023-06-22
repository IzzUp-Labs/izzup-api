import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HomepageCardEntity } from "./entities/homepage-card.entity";
import { Repository } from "typeorm";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { ConfigService } from "@nestjs/config";
import { HomepageCardDto } from "./dto/homepage-card.dto";

@Injectable()
export class HomepageCardService{
  constructor(
    @InjectRepository(HomepageCardEntity)
    private readonly homepageCardRepository: Repository<HomepageCardEntity>,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,

    private readonly configService: ConfigService
  ) {
  }

  async create(homepageCardDto: HomepageCardDto, file: Express.Multer.File) {
    return this.homepageCardRepository.save(
      this.homepageCardRepository.create(homepageCardDto)
    ).then(async (homepageCard) => {
      if(file) {
        await this.updatePhoto(homepageCard.id, file);
      }
    });
  }

  findAll() {
    return this.homepageCardRepository.find();
  }

  findOne(fields: EntityCondition<HomepageCardEntity>) {
    return this.homepageCardRepository.findOne({ where: fields });
  }

  update(id: number, homepageCardDto) {
    return this.homepageCardRepository.save(
      this.homepageCardRepository.create({
        id,
        ...homepageCardDto
      })
    );
  }

  remove(id: number) {
    return this.homepageCardRepository.delete(id);
  }

  async updatePhoto(id: number, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const bucket = this.firebase.storage.bucket(this.configService.get("firebase.storage_name"))
      .file(this.configService.get("firebase.homepage_bucket_name") + id + "." + fileExtension);

    const blobStream = bucket.createWriteStream({
      resumable: false,
    });
    blobStream.on('error', () => {
      return new HttpException("Something went wrong with the upload", 500)
    });
    blobStream.on('finish', () => {
      bucket.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      }).then(signedUrls => {
        this.homepageCardRepository.createQueryBuilder()
          .where("id = :id", { id: id })
          .update(HomepageCardEntity)
          .set({ photo: signedUrls[0] })
          .execute();
      });
    });
    blobStream.end(file.buffer);
  }
}