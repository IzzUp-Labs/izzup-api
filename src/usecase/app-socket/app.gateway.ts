import {
    WebSocketGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    ConnectedSocket
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {SocketService} from "./socket.service";
import {ParamCheckService} from "../../domain/middleware/param-check/param-check.service";

@WebSocketGateway({namespace: 'app-socket', cors: {origin: "*"}})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private socketService: SocketService,
        private readonly paramCheckService: ParamCheckService
    ){}

    @WebSocketServer()
    public server: Server;
    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server) {
        this.socketService.socket = server;
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        const tokenId  = this.paramCheckService.decodeId(client.handshake.headers.authorization);
        this.logger.log(`Client args: ${tokenId}`);
        await this.socketService.createSocketSession(client.id , tokenId).then(response => {
            this.logger.log(`Created Socket session: ${response}`);
        });
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        await this.socketService.deleteSocketSession(client.id);
        client.disconnect();
    }
}