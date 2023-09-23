import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessagingRoomEntity } from "./entities/messaging-room.entity";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { EntityCondition } from "../../domain/utils/types/entity-condition.type";

@Injectable()
export class MessagingRoomService {

  constructor(
    @InjectRepository(MessagingRoomEntity)
    private messagingRoomRepository: Repository<MessagingRoomEntity>,
    private userService: UserService
  ) {
  }

  async create(userId: string, participant: string) {
    const user = await this.userService.findOne({ id: userId });
    const participantUser = await this.userService.findOne({ id: participant });
    return this.messagingRoomRepository.save({
      createdBy: user,
      participant: participantUser
    });
  }

  findAll() {
    return this.messagingRoomRepository.find();
  }

  async findOne(fields: EntityCondition<MessagingRoomEntity>) {
    return this.messagingRoomRepository.findOne({ where: fields });
  }

  async remove(id: string) {
    return this.messagingRoomRepository.delete({ id: id });
  }

  async findRoom(roomId: string){
    return this.messagingRoomRepository.createQueryBuilder("messaging_room")
        .leftJoinAndSelect("messaging_room.participant", "participant")
        .leftJoinAndSelect("messaging_room.createdBy", "createdBy")
        .where("messaging_room.id = :roomId", { roomId: roomId })
        .getOne();
  }

  findAllUserRooms(userId: string) {
    return this.messagingRoomRepository.createQueryBuilder("messaging_room")
      .leftJoinAndSelect("messaging_room.createdBy", "createdBy")
      .leftJoinAndSelect("messaging_room.participant", "participant")
      .where("messaging_room.createdBy = :userId", { userId: userId })
      .orWhere("messaging_room.participant = :userId", { userId: userId })
      .getMany();
  }
}
