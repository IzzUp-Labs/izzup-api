import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthLoginDto } from "../../../application/auth/dto/auth-login.dto";
import { AuthRegisterDto } from "../../../application/auth/dto/auth-register.dto";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { AuthRegisterExtraDto } from "../../../application/auth/dto/auth-register-extra.dto";
import { ExtraService } from "../extra/extra.service";
import { AuthRegisterEmployerDto } from "../../../application/auth/dto/auth-register-employer.dto";
import { EmployerService } from "../employer/employer.service";
import { CompanyService } from "../company/company.service";
import { AuthMembershipCheckDto } from "../../../application/auth/dto/auth-membership-check.dto";
import { DataSource } from "typeorm";
import { UserEntity } from "../../../infrastructure/entities/user.entity";
import { EmployerEntity } from "../../../infrastructure/entities/employer.entity";
import { CompanyEntity } from "../../../infrastructure/entities/company.entity";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private extraService: ExtraService,
    private employerService: EmployerService,
    private companyService: CompanyService,
    private dataSource: DataSource
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
    });
    await this.extraService.create({
      ...authRegisterExtraDto,
      user_id: createdUser.id
    });
  }

  async registerEmployer(authRegisterEmployer: AuthRegisterEmployerDto) {
    const hashedPassword = await bcrypt.hash(authRegisterEmployer.password, 10);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const createdUser = await queryRunner.manager.save(UserEntity, {
        ...authRegisterEmployer,
        email: authRegisterEmployer.email,
        role: 'EMPLOYER',
        password: hashedPassword,
      });
      const createdEmployer = await queryRunner.manager.save(EmployerEntity,{
        ...authRegisterEmployer,
        user_id: createdUser.id
      });
      await queryRunner.manager.save(CompanyEntity,{
        ...authRegisterEmployer.company,
        employer_id: createdEmployer.id
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
