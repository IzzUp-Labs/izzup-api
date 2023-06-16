import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { AuthRegisterExtraDto } from "./dto/auth-register-extra.dto";
import { ExtraService } from "../extra/extra.service";
import { AuthRegisterEmployerDto } from "./dto/auth-register-employer.dto";
import { EmployerService } from "../employer/employer.service";
import { CompanyService } from "../company/company.service";
import { AuthMembershipCheckDto } from "./dto/auth-membership-check.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private extraService: ExtraService,
    private employerService: EmployerService,
    private companyService: CompanyService
  ) {
  }

  validateLogin(authLoginDto: AuthLoginDto): Promise<{ token: string }> {
    return this.userService.findOne({
      email: authLoginDto.email
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

  async register(authRegisterDto: AuthRegisterDto) : Promise<void> {
    const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);
    await this.userService.create({
      ...authRegisterDto,
      password: hashedPassword
    });
  }

  async isMember(authMembershipCheckDto: AuthMembershipCheckDto): Promise<boolean> {
    const user = await this.userService.findOne({
      email: authMembershipCheckDto.email
    });
    return !!user;
  }

  async registerExtra(authRegisterExtraDto: AuthRegisterExtraDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);
    const createdUser = await this.userService.create({
      ...authRegisterExtraDto,
      email: authRegisterExtraDto.email,
      role: 'EXTRA',
      password: hashedPassword,
      date_of_birth: authRegisterExtraDto.date_of_birth,
    });
    await this.extraService.create({
      ...authRegisterExtraDto,
      user_id: createdUser.id
    });
  }

  async registerEmployer(authRegisterEmployer: AuthRegisterEmployerDto) {
    const hashedPassword = await bcrypt.hash(authRegisterEmployer.password, 10);
    const createdUser = await this.userService.create({
      ...authRegisterEmployer,
      email: authRegisterEmployer.email,
      role: 'EMPLOYER',
      password: hashedPassword,
      date_of_birth: authRegisterEmployer.date_of_birth,
    });
    const createdEmployer = await this.employerService.create({
      ...authRegisterEmployer,
      user_id: createdUser.id
    });
    await this.companyService.create({
      ...authRegisterEmployer.company,
      employer_id: createdEmployer.id
    });
  }
}
