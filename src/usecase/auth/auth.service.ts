import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs";
import { AuthRegisterExtraDto } from "./dto/auth-register-extra.dto";
import { ExtraService } from "../extra/extra.service";
import { AuthRegisterEmployerDto } from "./dto/auth-register-employer.dto";
import { EmployerService } from "../employer/employer.service";
import { CompanyService } from "../company/company.service";
import { AuthMembershipCheckDto } from "./dto/auth-membership-check.dto";
import { RoleEnum } from "../../domain/utils/enums/role.enum";
import { UserEntity } from "../user/entities/user.entity";
import { UserStatusEnum } from "../../domain/utils/enums/user-status.enum";
import { LocationService } from "../location/location.service";
import { SocketService } from "../app-socket/socket.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private extraService: ExtraService,
    private employerService: EmployerService,
    private companyService: CompanyService,
    private locationService: LocationService,
    private socketService: SocketService
  ) {
  }

  validateLogin(authLoginDto: AuthLoginDto): Promise<{ token: string }> {
    return this.userService.findOne({
      email: authLoginDto.email.toLowerCase()
    }).then((user) => {
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            reason: "Account not found or incorrect email"
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      return bcrypt.compare(authLoginDto.password, user.password).then((result) => {
        if (result) {
          const token = this.jwtService.sign({
            id: user.id,
            email: user.email
          });
          return {
            token
          };
        } else {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              reason: "Incorrect password"
            },
            HttpStatus.UNPROCESSABLE_ENTITY
          );
        }
      });
    });
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async isMember(authMembershipCheckDto: AuthMembershipCheckDto): Promise<boolean> {
    const user = await this.userService.findOne({
      email: authMembershipCheckDto.email.toLowerCase()
    });
    return !!user;
  }

  async registerExtra(authRegisterExtraDto: AuthRegisterExtraDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);
    const extra = await this.extraService.create({
      address: authRegisterExtraDto.address
    });
    return await this.userService.create({
      ...authRegisterExtraDto,
      email: authRegisterExtraDto.email.toLowerCase(),
      password: hashedPassword,
      role: RoleEnum.EXTRA,
      extra: extra
    }).then((user) => {
      this.userService.addStatus(user.id, UserStatusEnum.UNVERIFIED);
      return user;
    });
  }

  async registerEmployer(authRegisterEmployer: AuthRegisterEmployerDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(authRegisterEmployer.password, 10);
    const employer = await this.employerService.create({});
    const user = await this.userService.create({
      ...authRegisterEmployer,
      email: authRegisterEmployer.email.toLowerCase(),
      password: hashedPassword,
      role: RoleEnum.EMPLOYER,
      employer: employer
    }).then((user) => {
      this.userService.addStatus(user.id, UserStatusEnum.UNVERIFIED);
      return user;
    });
    const company_location = await this.locationService.create({
      ...authRegisterEmployer.location
    });
    await this.companyService.create({
      ...authRegisterEmployer.company,
      employer: employer,
      location: company_location
    });
    return user;
  }

  async getConnectedDevices() {
    await this.socketService.getConnectedClients();
  }

  // TODO : Add logout function
  async logout() {
    return true;
  }
}
