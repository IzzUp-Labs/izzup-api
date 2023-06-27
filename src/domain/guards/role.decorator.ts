import { SetMetadata } from "@nestjs/common";

export const RoleGuard = (roles: string[]) =>
  SetMetadata("role", roles);