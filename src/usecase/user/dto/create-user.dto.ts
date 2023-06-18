import {ApiProperty} from "@nestjs/swagger";
import {EmployerEntity} from "../../employer/entities/employer.entity";
import {ExtraEntity} from "../../extra/entities/extra.entity";

export class CreateUserDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    date_of_birth: Date;
    @ApiProperty()
    role: string;
    @ApiProperty()
    employer?: EmployerEntity;
    @ApiProperty()
    extra?: ExtraEntity;
}
