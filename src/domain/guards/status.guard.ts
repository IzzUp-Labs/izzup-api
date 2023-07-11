import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../../usecase/user/user.service";
import { AuthService } from "../../usecase/auth/auth.service";

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const status = this.reflector.get<string>("status", context.getHandler());
    if (!status) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.authService.decodeToken(request.headers.authorization.split(" ")[1]) as { id: number };
    if (!token) {
      return false;
    }
    const userEntity = await this.userService.findOne({ id: token.id });
    if (!userEntity) {
      return false;
    }
    return userEntity?.statuses.some(userStatus => userStatus.name == status);
  }
}
