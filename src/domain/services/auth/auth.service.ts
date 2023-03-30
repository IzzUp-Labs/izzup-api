import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthLoginDto } from "../../../application/auth/dto/auth-login.dto";
import { AuthRegisterDto } from "../../../application/auth/dto/auth-register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from 'bcrypt';
import { UserEntity } from "../../../infrastructure/entities/user.entity";
import { FindOptionsWhere } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  validateLogin(authLoginDto: AuthLoginDto): Promise<{token:string}> {
    return this.userService.findOne({
      email: authLoginDto.email,
    }).then((user) => {
      if (!user) {
        return null;
      }
      return bcrypt.compare(authLoginDto.password, user.password).then((result) => {
        if (result) {
          const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
          });
          return {
            token
          };
        }else{
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                password: 'Incorrect password',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          )
        }
      });
    });
  }

  async register(authRegisterDto: AuthRegisterDto) : Promise<void> {
    const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);
    await this.userService.create({
      ...authRegisterDto,
      password: hashedPassword,
    });
  }
}
