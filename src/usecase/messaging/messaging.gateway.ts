import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect, ConnectedSocket, WebSocketServer
} from '@nestjs/websockets';
import {Logger} from "@nestjs/common";
import { MessagingService } from './messaging.service';
import {Socket, Server} from "socket.io";
import {UserService} from "../user/user.service";
import {MessagingRoomService} from "./messaging-room.service";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";
@WebSocketGateway({namespace: 'messaging', cors: {origin: '*'}})
export class MessagingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  private logger: Logger = new Logger('MessagingGateway');
  constructor(
      private readonly messagingService: MessagingService,
      private readonly userService: UserService,
      private readonly messagingRoomService: MessagingRoomService,
      private readonly paramCheckService: ParamCheckService
  ) {}

  afterInit(server: Server): any {
    server.on('connection', (socket: any) => {
        this.logger.log('Initialized');
    });
  }
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const tokenId  = this.paramCheckService.decodeId(client.handshake.headers.authorization);
    this.logger.log(`Client args: ${tokenId}`);
    await this.messagingService.createMessagingSession(client.id , tokenId).then(response => {
        this.logger.log(`Created messaging session: ${response}`);
    });
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected: ' + client.id);
    await this.messagingService.deleteMessagingSession(client.id);
    client.disconnect();
  }

  @SubscribeMessage('send_message')
  async create(@ConnectedSocket() client: Socket, @MessageBody('content') content: string, @MessageBody('authorId') authorId: number, @MessageBody('roomId') roomId: string) {
    const author = await this.userService.findOne({id: authorId});
    this.logger.log(`Client created message in: ${roomId}`);
    this.logger.log(`Client created message with content: ${content}`);
    const message = await this.messagingService.create({
        content: content,
        roomId: roomId,
        author: author,
    });
    this.server.to(roomId).emit('receive_message', message);
  }

  @SubscribeMessage('create_room')
  async createRoom(@ConnectedSocket() client: Socket, @MessageBody('createdBy') createdBy: number, @MessageBody('participant') participant: number ) {
    const room = await this.messagingRoomService.create(createdBy, participant);
    this.logger.log(`Client created room: ${room.id}`);
    this.server.emit('room_created', room);
  }

  @SubscribeMessage('request_all_messages')
  async findAll(@ConnectedSocket() client: Socket) {
    const messages = await this.messagingService.findAll();
    client.emit('receive_all_messages', messages);
  }

  @SubscribeMessage('join_room')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string) {
    this.logger.log(`DATA OF THE BODY: ${roomId}`);
    client.join(roomId);
    this.logger.log(`Client joined room: ${roomId}`);
    client.emit('joined_room', roomId);
  }

  @SubscribeMessage('leave_room')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string) {
    client.leave(roomId);
    this.logger.log(`Client left room: ${roomId}`);
    client.emit('left_room', roomId);
  }

  @SubscribeMessage('request_all_room_messages')
  async findAllRoomMessages(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string) {
    const messages = await this.messagingService.findAllRoomMessages(roomId);
    client.emit('receive_all_room_messages', messages);
  }

  @SubscribeMessage('request_all_rooms')
  async findAllRooms(@ConnectedSocket() client: Socket, @MessageBody('userId') userId: number) {
    const rooms = await this.messagingRoomService.findAllUserRooms(userId);
    client.emit('receive_all_rooms', rooms);
  }

  @SubscribeMessage('delete_room')
  async deleteRoom(@ConnectedSocket() client: Socket, @MessageBody('roomId') roomId: string) {
    this.logger.log(`DATA OF THE BODY: ${roomId}`);
    await this.messagingRoomService.remove(roomId);
    client.emit('deleted_room', roomId);
  }

  @SubscribeMessage('typing')
  async typing(@ConnectedSocket() client: Socket, @MessageBody('userId') userId: number, @MessageBody('roomId') roomId: string, @MessageBody('isTyping') isTyping: boolean) {
    const user = await this.userService.findOne({id: userId});
    client.broadcast.to(roomId).emit('typing', {user: user, isTyping: isTyping});
  }
}
