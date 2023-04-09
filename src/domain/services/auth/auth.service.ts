import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthLoginDto } from '../../../application/auth/dto/auth-login.dto';
import { AuthRegisterDto } from '../../../application/auth/dto/auth-register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthRegisterExtraDto } from "../../../application/auth/dto/auth-register-extra.dto";
import { ExtraService } from "../extra/extra.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private extraService: ExtraService,
  ) {}
  validateLogin(authLoginDto: AuthLoginDto): Promise<{token:string}> {
    return this.userService.findOne({
      email: authLoginDto.email,
    }).then((user) => {
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            reason: 'Account not found or incorrect email',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      return bcrypt.compare(authLoginDto.password, user.password).then((result) => {
        if (result) {
          const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
          });
          return {
            token,
          };
        } else {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              reason: 'Incorrect password',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      });
    });
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);
    await this.userService.create({
      ...authRegisterDto,
      password: hashedPassword,
    });
  }

  async registerExtra(authRegisterExtraDto: AuthRegisterExtraDto) : Promise<void> {
    const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);
    const createdUser = await this.userService.create({
      ...authRegisterExtraDto,
      password: hashedPassword,
    });
    await this.extraService.create({
      ...authRegisterExtraDto,
      user_id: createdUser.id,
    });
  }
}
