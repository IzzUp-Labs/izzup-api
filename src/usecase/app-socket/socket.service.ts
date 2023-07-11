import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { AppSocketSessionEntity } from "./entities/app-socket-session.entity";
import { Repository } from "typeorm";

@Injectable()
export class SocketService {
  public socket: Server = null;

  constructor(
    @InjectRepository(AppSocketSessionEntity)
    private appSocketSessionRepository: Repository<AppSocketSessionEntity>
  ) {
  }

  async createSocketSession(clientId: string, userId: string) {
    await this.appSocketSessionRepository.delete({
      userId: userId
    });
    return await this.appSocketSessionRepository.save({
      clientId: clientId,
      userId: userId
    });
  }

  async deleteSocketSession(clientId: string) {
    return this.appSocketSessionRepository.delete({ clientId: clientId });
  }

  // Get clientID by UserID in appSocketSession
  async findClientByUserId(userId: string) {
    const user = await this.appSocketSessionRepository.findOne({
      where: {
        userId: userId
      }
    });
    return user?.clientId;
  }

  async getConnectedClients() {
    return this.appSocketSessionRepository.find();
  }
}
