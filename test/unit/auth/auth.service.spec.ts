import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/domain/services/auth/auth.service';
import { UserService } from "../../../src/domain/services/user/user.service";
import { ExtraService } from "../../../src/domain/services/extra/extra.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../../../src/infrastructure/entities/user.entity";
import { ExtraEntity } from "../../../src/infrastructure/entities/extra.entity";
import { AuthLoginDto } from "../../../src/application/auth/dto/auth-login.dto";
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from "@nestjs/common";
import { AuthRegisterDto } from "../../../src/application/auth/dto/auth-register.dto";
import { AuthRegisterExtraDto } from "../../../src/application/auth/dto/auth-register-extra.dto";

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let extraService: ExtraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UserService,
        ExtraService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockReturnValue({
              id: 1,
              email: 'test@example.com',
              password: 'password',
              last_name: "lastName",
              first_name: "firstName",
            }),
          },
        },
        {
          provide: getRepositoryToken(ExtraEntity),
          useValue: ExtraEntity,
        }
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    extraService = module.get<ExtraService>(ExtraService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateLogin', () => {
    const authLoginDto: AuthLoginDto = {
      email: 'test@example.com',
      password: 'test-password',
    };

    it('should return a token if the login is valid', async () => {
      const user: UserEntity = {
        id: 1,
        email: authLoginDto.email,
        password: await bcrypt.hash(authLoginDto.password, 10),
        last_name: "lastName",
        first_name: "firstName",
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      const jwtSignSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.validateLogin(authLoginDto);

      expect(result).toEqual({ token: 'test-token' });
      expect(jwtSignSpy).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
    });

    it('should throw an HttpException if the password is incorrect', async () => {
      const user = {
        id: 1,
        email: authLoginDto.email,
        password: await bcrypt.hash('wrong-password', 10),
        last_name: "lastName",
        first_name: "firstName",
        address: "address",
        created_at: new Date(),
        updated_at: new Date()
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

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
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'Incorrect password',
        },
      });
    });

    it('should return null if the user is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await service.validateLogin(authLoginDto);

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const authRegisterDto: AuthRegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(authRegisterDto.password, 10);

      jest.spyOn<any, any>(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const createdUser: UserEntity = {
        id: 1,
        email: authRegisterDto.email,
        password: hashedPassword,
        last_name: "lastName",
        first_name: "firstName",
        created_at: new Date(),
        updated_at: new Date()
      };

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      await expect(service.register(authRegisterDto)).resolves.toBeUndefined();

      expect(bcrypt.hash).toHaveBeenCalledWith(authRegisterDto.password, 10);
      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterDto,
        password: hashedPassword,
      });
    });
  });

  describe('registerExtra', () => {
    it('should create a new user and extra record', async () => {
      // Arrange
      const authRegisterExtraDto: AuthRegisterExtraDto = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: new Date(),
        address: '123 Test Street',
        function: 'Test',
      };

      const hashedPassword = await bcrypt.hash(authRegisterExtraDto.password, 10);

      jest.spyOn<any, any>(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      const createdUser = { id: 1 } as UserEntity;
      const createdExtra = { id: 1 } as ExtraEntity;
      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);
      jest.spyOn(extraService, 'create').mockResolvedValue(createdExtra);

      await service.registerExtra(authRegisterExtraDto);

      expect(userService.create).toHaveBeenCalledWith({
        ...authRegisterExtraDto,
        password: hashedPassword,
      });
      expect(extraService.create).toHaveBeenCalledWith({
        ...authRegisterExtraDto,
        user_id: createdUser.id,
      });
    });
  });

});
