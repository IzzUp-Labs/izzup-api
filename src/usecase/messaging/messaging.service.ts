import { Injectable } from "@nestjs/common";
import { CreateMessagingDto } from "./dto/create-messaging.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessagingSessionEntity } from "./entities/messaging-session.entity";
import { MessagingEntity } from "./entities/messaging.entity";
import { MessagingRoomService } from "./messaging-room.service";

@Injectable()
export class MessagingService {

  constructor(
    @InjectRepository(MessagingEntity)
    private messagingRepository: Repository<MessagingEntity>,
    @InjectRepository(MessagingSessionEntity)
    private messagingSessionRepository: Repository<MessagingSessionEntity>,
    private readonly messagingRoomService: MessagingRoomService
  ) {
  }

  async create(createMessagingDto: CreateMessagingDto) {
    const room = await this.messagingRoomService.findOne({ id: createMessagingDto.roomId });
    return this.messagingRepository.save({
      content: createMessagingDto.content,
      author: createMessagingDto.author,
      room: room
    });
  }

  async createMessagingSession(clientId: string, userId: string) {
    return this.messagingSessionRepository.save({
      clientId: clientId,
      userId: userId
    });
  }

  async deleteMessagingSession(clientId: string) {
    return this.messagingSessionRepository.delete({ clientId: clientId });
  }

  findAll() {
    return this.messagingRepository.find({ relations: ["author"], order: { creationDate: "ASC" } });
  }

  findAllRoomMessages(roomId: string) {
    return this.messagingRepository.createQueryBuilder("messaging")
      .leftJoinAndSelect("messaging.author", "author")
      .where("messaging.room = :roomId", { roomId: roomId })
      .orderBy("messaging.creationDate", "ASC")
      .getMany();
  }
}
