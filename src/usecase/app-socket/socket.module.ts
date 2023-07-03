import { Module, Global } from '@nestjs/common';
import { SocketService } from './socket.service';
import {AppGateway} from "./app.gateway";
import {ParamCheckModule} from "../../domain/middleware/param-check/param-check.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppSocketSessionEntity} from "./entities/app-socket-session.entity";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AppSocketSessionEntity]) ,ParamCheckModule],
    controllers: [],
    providers: [SocketService, AppGateway],
    exports: [SocketService],
})
export class SocketModule {}