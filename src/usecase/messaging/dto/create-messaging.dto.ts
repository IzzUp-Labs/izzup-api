import {UserEntity} from "../../user/entities/user.entity";

export class CreateMessagingDto {
     content: string;
     author: UserEntity;
     roomId: string;
}
