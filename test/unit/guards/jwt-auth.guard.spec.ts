import { JwtAuthGuard } from "../../../src/domain/guards/jwt-auth.guard";
import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn()
          }
        }
      ]
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return true if canActivate returns true", async () => {
    const canActivateSpy = jest
      .spyOn(guard, "canActivate")
      .mockResolvedValue(true);

    const context: ExecutionContext = {} as ExecutionContext;
    const result = await guard.canActivate(context);

    expect(result).toEqual(true);
    expect(canActivateSpy).toHaveBeenCalled();
  });

  it("should throw an error if canActivate returns false", async () => {
    const canActivateSpy = jest
      .spyOn(guard, "canActivate")
      .mockResolvedValue(false);

    const context: ExecutionContext = {} as ExecutionContext;

    try {
      await guard.canActivate(context);
    } catch (err) {
      expect(err).toEqual(new Error("Unauthorized"));
      expect(canActivateSpy).toHaveBeenCalled();
    }
  });
});
