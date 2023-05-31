import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../../src/domain/services/auth/auth.service";
import { UserService } from "../../../src/domain/services/user/user.service";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/infrastructure/entities/user.entity";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { AuthLoginDto } from "../../../src/application/auth/dto/auth-login.dto";
import * as bcrypt from "bcrypt";
import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthRegisterDto } from "../../../src/application/auth/dto/auth-register.dto";
import { AuthRegisterExtraDto } from "../../../src/application/auth/dto/auth-register-extra.dto";
import { EmployerService } from "../../../src/domain/services/employer/employer.service";
import { CompanyService } from "../../../src/domain/services/company/company.service";
import { EmployerEntity } from "../../../src/infrastructure/entities/employer.entity";
import { CompanyEntity } from "../../../src/infrastructure/entities/company.entity";
import { AuthRegisterEmployerDto } from "../../../src/application/auth/dto/auth-register-employer.dto";
import { AuthMembershipCheckDto } from "../../../src/application/auth/dto/auth-membership-check.dto";
import { CompanyDto } from "../../../src/application/company/dto/company.dto";
import { JobOfferService } from "../../../src/domain/services/job-offer/job-offer.service";
import { JobOfferEntity } from "../../../src/infrastructure/entities/job-offer.entity";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let extraService: ExtraService;
  let employerService: EmployerService;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UserService,
        ExtraService,
        EmployerService,
        CompanyService,
        JobOfferService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
              id: 1,
              email: "test@example.com",
              password: "password",
              last_name: "lastName",
              first_name: "firstName",
              role: 'USER'
            }),
          },
        },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity
        },
        {
          provide: getRepositoryToken(EmployerEntity),
          useValue: EmployerEntity
        },
        {
          provide: getRepositoryToken(CompanyEntity),
          useValue: CompanyEntity
        },
        {
          provide: getRepositoryToken(JobOfferEntity),
          useValue: JobOfferEntity
        }
      ]
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    extraService = module.get<ExtraService>(ExtraService);
    service = module.get<AuthService>(AuthService);
    employerService = module.get<EmployerService>(EmployerService);
    companyService = module.get<CompanyService>(CompanyService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateLogin", () => {
    const authLoginDto: AuthLoginDto = {
      email: "test@example.com",
      password: "test-password"
    };

    it("should return a token if the login is valid", async () => {
      const user: UserEntity = {
        id: 1,
        email: authLoginDto.email,
        password: await bcrypt.hash(authLoginDto.password, 10),
        last_name: "lastName",
        first_name: "firstName",
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(userService, "findOne").mockResolvedValue(user);
      const jwtSignSpy = jest.spyOn(jwtService, "sign").mockReturnValue("test-token");

      const result = await service.validateLogin(authLoginDto);

      expect(result).toEqual({ token: "test-token" });
      expect(jwtSignSpy).toHaveBeenCalledWith({
        id: user.id,
        email: user.email
      });
    });

    it('should throw an HttpException if the password is incorrect', async () => {
      const user : UserEntity = {
        id: 1,
        email: authLoginDto.email,
        password: await bcrypt.hash("wrong-password", 10),
        last_name: "lastName",
        first_name: "firstName",
        role: "USER",
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(userService, "findOne").mockResolvedValue(user);

      let error;
      try {
        await service.validateLogin(authLoginDto);
      } catch (e) {
        error = e;
      }

      // Assert
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(error.getResponse()).toEqual({
        status: 422,
        reason: "Incorrect password"
      });
    });

    it("should return null if the user is not found", async () => {
      jest.spyOn(userService, "findOne").mockResolvedValue(null);

      await expect(service.validateLogin(authLoginDto)).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            reason: "Account not found or incorrect email"
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        )
      );
    });
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const authRegisterDto: AuthRegisterDto = {
        email: "test@example.com",
        password: "password"
      };
      const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);

      jest.spyOn<any, any>(bcrypt, "hash").mockResolvedValue(hashedPassword);

      const createdUser: UserEntity = {
        id: 1,
        email: authRegisterDto.email,
        password: hashedPassword,
        last_name: "lastName",
        first_name: "firstName",
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(userService, "create").mockResolvedValue(createdUser);

      await expect(service.register(authRegisterDto)).resolves.toBeUndefined();

      expect(bcrypt.hash).toHaveBeenCalledWith(authRegisterDto.password, 10);
      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterDto,
        password: hashedPassword
      });
    });
  });

  describe('registerExtra', () => {
    it('should create a new user and extra', async () => {
      // Arrange
      const authRegisterExtraDto: AuthRegisterExtraDto = {
        email: "test@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: new Date(),
        address: '123 Test Street',
      };

      const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);

      jest.spyOn<any, any>(bcrypt, "hash").mockResolvedValue(hashedPassword);

      const createdUser = { id: 1 } as UserEntity;
      const createdExtra = { id: 1 } as ExtraEntity;
      jest.spyOn(userService, "create").mockResolvedValue(createdUser);
      jest.spyOn(extraService, "create").mockResolvedValue(createdExtra);

      await service.registerExtra(authRegisterExtraDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterExtraDto,
        email: authRegisterExtraDto.email,
        role: 'EXTRA',
        password: hashedPassword
      });
      expect(extraService.create).toHaveBeenCalledWith({
        ...authRegisterExtraDto,
        user_id: createdUser.id
      });
    });
  });

  describe('registerEmployer', () => {
    it('should create a new user and employer', async () => {
      // Arrange
      const authRegisterEmployerDto: AuthRegisterEmployerDto = {
        email: "test@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: new Date(),
        company: new CompanyDto()
      }

      const hashedPassword = await bcrypt.hash(authRegisterEmployerDto.password, 10);

      jest.spyOn<any, any>(bcrypt, "hash").mockResolvedValue(hashedPassword);

      const createdUser = { id: 1 } as UserEntity;
      const createdEmployer = { id: 1 } as EmployerEntity;
      const createdCompany = { id: 1 } as CompanyEntity;
      jest.spyOn(userService, "create").mockResolvedValue(createdUser);
      jest.spyOn(employerService, "create").mockResolvedValue(createdEmployer);
      jest.spyOn(companyService, "create").mockResolvedValue(createdCompany);

      await service.registerEmployer(authRegisterEmployerDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterEmployerDto,
        email: authRegisterEmployerDto.email,
        role: 'EMPLOYER',
        password: hashedPassword
      });

      expect(employerService.create).toHaveBeenCalledWith({
        ...authRegisterEmployerDto,
        user_id: createdUser.id
      });

      expect(companyService.create).toHaveBeenCalledWith({
        ...authRegisterEmployerDto.company,
        employer_id: createdEmployer.id
      });
    });
  });

  describe('Membership check', () => {
    it('should return true if the user is a member', async () => {
      const authMembershipCheckDto: AuthMembershipCheckDto = {
        email: "test@exemple.com",
      };
      const user : UserEntity = {
        id: 1,
        email: authMembershipCheckDto.email,
        password: await bcrypt.hash("password", 10),
        last_name: "lastName",
        first_name: "firstName",
        role: "USER",
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(userService, "findOne").mockResolvedValueOnce(user);
      expect(await service.isMember(authMembershipCheckDto)).toBe(true);
    });
    it("should return false if the user is not a member", async () => {
      const authMembershipCheckDto: AuthMembershipCheckDto = {
        email: "test@exemple.com",
      };
      jest.spyOn(userService, "findOne").mockResolvedValueOnce(null);
      expect(await service.isMember(authMembershipCheckDto)).toBe(false);
    });
  });
});
