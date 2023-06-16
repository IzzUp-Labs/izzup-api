import { UserEntity } from "../../usecase/user/entities/user.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

type JwtPayload = Pick<UserEntity, "id"> & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("auth.secret")
    });
  }

  public validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
