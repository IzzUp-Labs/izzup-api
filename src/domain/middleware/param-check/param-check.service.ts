import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ParamCheckService {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

check(token: string, paramId: number): boolean {
    const tokenDecoded = this.jwtService.decode(token.split(" ")[1]) as { id: number };
    if(!tokenDecoded) {
      return false;
    }
    return tokenDecoded.id == paramId;
}
}