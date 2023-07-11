import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../../src/usecase/auth/auth.service";
import { UserService } from "../../../src/usecase/user/user.service";
import { ExtraService } from "../../../src/usecase/extra/extra.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/usecase/user/entities/user.entity";
import { ExtraEntity } from "../../../src/usecase/extra/entities/extra.entity";
import { AuthLoginDto } from "../../../src/usecase/auth/dto/auth-login.dto";
import * as bcrypt from "bcryptjs";
import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthRegisterExtraDto } from "../../../src/usecase/auth/dto/auth-register-extra.dto";
import { EmployerService } from "../../../src/usecase/employer/employer.service";
import { CompanyService } from "../../../src/usecase/company/company.service";
import { EmployerEntity } from "../../../src/usecase/employer/entities/employer.entity";
import { CompanyEntity } from "../../../src/usecase/company/entities/company.entity";
import { AuthRegisterEmployerDto } from "../../../src/usecase/auth/dto/auth-register-employer.dto";
import { AuthMembershipCheckDto } from "../../../src/usecase/auth/dto/auth-membership-check.dto";
import { CompanyDto } from "../../../src/usecase/company/dto/company.dto";
import { JobOfferService } from "../../../src/usecase/job-offer/job-offer.service";
import { JobOfferEntity } from "../../../src/usecase/job-offer/entities/job-offer.entity";
import { ExtraJobRequestService } from "../../../src/usecase/extra/extra-job-request.service";
import { ExtraJobRequestEntity } from "../../../src/usecase/extra/entities/extra-job-request.entity";
import { UserStatusEnum } from "../../../src/domain/utils/enums/user-status.enum";
import { UserStatusService } from "../../../src/usecase/user-status/user-status.service";
import { Repository } from "typeorm";
import { UserStatusEntity } from "../../../src/usecase/user-status/entities/user-status.entity";
import { ConfigService } from "@nestjs/config";
import { FileExtensionChecker } from "../../../src/domain/utils/file-extension-checker/file-extension-checker";
import { LocationService } from "../../../src/usecase/location/location.service";
import { CreateLocationDto } from "../../../src/usecase/location/dto/create-location.dto";
import { LocationEntity } from "../../../src/usecase/location/entities/location.entity";
import { SocketService } from "../../../src/usecase/app-socket/socket.service";
import { NotificationService } from "../../../src/usecase/notification/notification.service";
import { AppSocketSessionEntity } from "../../../src/usecase/app-socket/entities/app-socket-session.entity";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let extraService: ExtraService;
  let employerService: EmployerService;
  let companyService: CompanyService;
  let userStatusService: UserStatusService;
  let locationService: LocationService;

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
        ExtraJobRequestService,
        UserStatusService,
        ConfigService,
        FileExtensionChecker,
        LocationService,
        SocketService,
        NotificationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
              id: "1",
              email: "test@example.com",
              password: "password",
              last_name: "lastName",
              first_name: "firstName",
              date_of_birth: new Date(),
              role: "USER",
              extra: null,
              employer: null,
              statuses: [{ id: "1", name: UserStatusEnum.UNVERIFIED }]
            })
          }
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
        },
        {
          provide: getRepositoryToken(ExtraJobRequestEntity),
          useValue: ExtraJobRequestEntity
        },
        {
          provide: getRepositoryToken(UserStatusEntity),
          useValue: Repository
        },
        {
          provide: getRepositoryToken(AppSocketSessionEntity),
          useValue: AppSocketSessionEntity
        },
        {
          provide: "FIREBASE_TOKEN",
          useValue: "FIREBASE_TOKEN"
        },
        {
          provide: getRepositoryToken(LocationEntity),
          useValue: LocationEntity
        }
      ]
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    extraService = module.get<ExtraService>(ExtraService);
    service = module.get<AuthService>(AuthService);
    employerService = module.get<EmployerService>(EmployerService);
    companyService = module.get<CompanyService>(CompanyService);
    userStatusService = module.get<UserStatusService>(UserStatusService);
    locationService = module.get<LocationService>(LocationService);
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
        id: "1",
        email: authLoginDto.email,
        password: await bcrypt.hash(authLoginDto.password, 10),
        last_name: "lastName",
        first_name: "firstName",
        date_of_birth: new Date(),
        photo: null,
        role: "USER",
        id_photo: null,
        extra: null,
        employer: null,
        rooms: null,
        is_email_confirmed: false,
        email_confirmation_code: null,
        fcm_tokens: [],
        statuses: [
          {
            id: "1",
            name: UserStatusEnum.UNVERIFIED,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
          }],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
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

    it("should throw an HttpException if the password is incorrect", async () => {
      const user: UserEntity = {
        id: "1",
        email: authLoginDto.email,
        password: await bcrypt.hash("wrong-password", 10),
        last_name: "lastName",
        first_name: "firstName",
        date_of_birth: new Date(),
        photo: null,
        role: "USER",
        id_photo: null,
        extra: null,
        employer: null,
        rooms: null,
        email_confirmation_code: null,
        is_email_confirmed: false,
        fcm_tokens: [],
        statuses: [
          {
            id: "1",
            name: UserStatusEnum.UNVERIFIED,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
          }],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
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

  describe("registerExtra", () => {
    it("should create a new user and extra", async () => {
      // Arrange
      const authRegisterExtraDto: AuthRegisterExtraDto = {
        email: "test@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: new Date(),
        address: "123 Test Street"
      };

      const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);

      jest.spyOn<any, any>(bcrypt, "hash").mockResolvedValue(hashedPassword);

      const createdUser = { id: "1" } as UserEntity;
      const createdExtra = { id: "1" } as ExtraEntity;
      jest.spyOn(userService, "create").mockResolvedValue(createdUser);
      jest.spyOn(extraService, "create").mockResolvedValue(createdExtra);
      jest.spyOn(userStatusService, "findOne").mockResolvedValue({
        id: "1",
        name: UserStatusEnum.UNVERIFIED
      } as UserStatusEntity);

      await service.registerExtra(authRegisterExtraDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterExtraDto,
        extra: {
          id: "1"
        },
        password: hashedPassword,
        role: "EXTRA"
      });
      expect(extraService.create).toHaveBeenCalledWith({
        address: authRegisterExtraDto.address
      });
    });
  });

  describe("registerEmployer", () => {
    it("should create a new user and employer", async () => {
      // Arrange
      const authRegisterEmployerDto: AuthRegisterEmployerDto = {
        email: "test@example.com",
        password: "password123",
        first_name: "John",
        last_name: "Doe",
        date_of_birth: new Date(),
        location: new CreateLocationDto(),
        company: new CompanyDto()
      };

      const hashedPassword = await bcrypt.hash(authRegisterEmployerDto.password, 10);

      jest.spyOn<any, any>(bcrypt, "hash").mockResolvedValue(hashedPassword);

      const createdUser = { id: "1" } as UserEntity;
      const createdEmployer = { id: "1" } as EmployerEntity;
      const createdLocation = { id: "1" } as LocationEntity;
      const createdCompany = { id: "1" } as CompanyEntity;
      jest.spyOn(userService, "create").mockResolvedValue(createdUser);
      jest.spyOn(employerService, "create").mockResolvedValue(createdEmployer);
      jest.spyOn(locationService, "create").mockResolvedValue(createdLocation);
      jest.spyOn(companyService, "create").mockResolvedValue(createdCompany);
      jest.spyOn(userStatusService, "findOne").mockResolvedValue({
        id: "1",
        name: UserStatusEnum.UNVERIFIED
      } as UserStatusEntity);

      await service.registerEmployer(authRegisterEmployerDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterEmployerDto,
        email: authRegisterEmployerDto.email,
        employer: {
          id: "1"
        },
        role: "EMPLOYER",
        password: hashedPassword
      });

      expect(employerService.create).toHaveBeenCalledWith({});

      expect(locationService.create).toHaveBeenCalledWith({});

      expect(companyService.create).toHaveBeenCalledWith({
        employer: {
          id: "1"
        },
        location: {
          id: "1"
        }
      });
    });
  });

  describe("Membership check", () => {
    it("should return true if the user is a member", async () => {
      const authMembershipCheckDto: AuthMembershipCheckDto = {
        email: "test@exemple.com"
      };
      const user: UserEntity = {
        id: "1",
        email: authMembershipCheckDto.email,
        password: await bcrypt.hash("password", 10),
        last_name: "lastName",
        first_name: "firstName",
        date_of_birth: new Date(),
        photo: null,
        id_photo: null,
        role: "USER",
        extra: null,
        employer: null,
        rooms: null,
        is_email_confirmed: false,
        email_confirmation_code: null,
        fcm_tokens: [],
        statuses: [
          {
            id: "1",
            name: UserStatusEnum.UNVERIFIED,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null
          }],
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      };
      jest.spyOn(userService, "findOne").mockResolvedValueOnce(user);
      expect(await service.isMember(authMembershipCheckDto)).toBe(true);
    });
    it("should return false if the user is not a member", async () => {
      const authMembershipCheckDto: AuthMembershipCheckDto = {
        email: "test@exemple.com"
      };
      jest.spyOn(userService, "findOne").mockResolvedValueOnce(null);
      expect(await service.isMember(authMembershipCheckDto)).toBe(false);
    });
  });
});
