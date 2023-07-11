import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ParamCheckService {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {
  }

  check(token: string, paramId: string): boolean {
    const tokenDecoded = this.jwtService.decode(token.split(" ")[1]) as { id: string };
    if (!tokenDecoded) {
      return false;
    }
    return tokenDecoded.id == paramId;
  }

  decodeId(token: string): string {
    const tokenDecoded = this.jwtService.decode(token.split(" ")[1]) as { id: string };
    return tokenDecoded.id;
  }
}
