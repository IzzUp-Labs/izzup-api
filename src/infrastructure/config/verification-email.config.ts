import { registerAs } from "@nestjs/config";

export default registerAs("verification-email", () => ({
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  EMAIL: process.env.EMAIL,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN
}));
