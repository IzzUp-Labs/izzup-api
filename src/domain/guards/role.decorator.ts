import { SetMetadata } from "@nestjs/common";

export const RoleGuard = (role: string) =>
  SetMetadata("role", role);