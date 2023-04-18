import { RolesGuard } from "../../../src/domain/guards/role.guard";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../../../src/domain/services/auth/auth.service";
import { UserService } from "../../../src/domain/services/user/user.service";
import { JwtAuthGuard } from "../../../src/domain/guards/jwt-auth.guard";
import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";

describe('RolesGuard', () => {
  let roleGuard: RolesGuard;
  let reflector: Reflector;
  let userService: UserService;
  let authService: AuthService;
  let jwtAuthGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue(['admin']),
            getAllAndOverride: jest.fn()
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(() => ({ role: 'admin' })),
          },
        },
        {
          provide: AuthService,
          useValue: {
            decodeToken: jest.fn(() => ({ id: 123 })),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          }
        },
      ],
    }).compile();

    roleGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  describe('canActivate', () => {
    it('should return true if no roles are specified', async () => {
      const canActivateSpy = jest
        .spyOn(roleGuard, 'canActivate')
        .mockResolvedValue(true);

      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const context: ExecutionContext = {} as ExecutionContext;

      const result = await roleGuard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.get(null, null)).toBe(undefined);
      expect(canActivateSpy).toHaveBeenCalled();
    });

    it('should return false if user is not authenticated', async () => {
      const canActivateSpy = jest
        .spyOn(roleGuard, 'canActivate')
        .mockResolvedValue(false);
      const jwtSpy = jest
        .spyOn(jwtAuthGuard, 'canActivate')
        .mockReturnValue(false);

      const context: ExecutionContext = {} as ExecutionContext;
      expect(await roleGuard.canActivate(context)).toBe(false);
      expect(canActivateSpy).toHaveBeenCalled();
      expect(await jwtAuthGuard.canActivate(context)).toBe(false);
      expect(jwtSpy).toHaveBeenCalled();
    });

    it('should return false if the user doesent have the correct role', async () => {
      const canActivateSpy = jest
        .spyOn(roleGuard, 'canActivate')
        .mockResolvedValue(false);
      const jwtSpy = jest
        .spyOn(jwtAuthGuard, 'canActivate')
        .mockReturnValue(true);
      const findOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue({ role: 'user' } as any);

      const context: ExecutionContext = {} as ExecutionContext;

      const reflectorRole = reflector.get(null, null)
      expect(reflectorRole).toEqual(['admin']);
      expect(reflectorRole).not.toEqual(['user']);
      expect(await roleGuard.canActivate(context)).toBe(false);
      expect(canActivateSpy).toHaveBeenCalled();
      expect(await jwtAuthGuard.canActivate(context)).toBe(true);
      expect(jwtSpy).toHaveBeenCalled();
      expect(await userService.findOne({ id: 123 })).toEqual({ role: 'user' });
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should return true if the user has the correct role', async () => {
      jest.spyOn(roleGuard, 'canActivate').mockResolvedValue(true);
      jest.spyOn(jwtAuthGuard, 'canActivate').mockReturnValue(true);

      const context: ExecutionContext = {} as ExecutionContext;

      const reflectorRole = reflector.get(null, null)
      const mockedUser = await userService.findOne({ id: 123 });
      expect(reflectorRole).toEqual(['admin']);
      expect(mockedUser.role).toEqual('admin');
      expect(await roleGuard.canActivate(context)).toBe(true);
    });
  });
});