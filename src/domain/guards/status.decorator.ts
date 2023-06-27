import {SetMetadata} from "@nestjs/common";

export const StatusGuard = (status: string) =>
    SetMetadata("status", status);