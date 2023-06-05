import { registerAs } from "@nestjs/config";

export default registerAs("seed-user", () => ({
  seed_admin_firstname: process.env.SEED_ADMIN_FIRSTNAME,
  seed_admin_lastname: process.env.SEED_ADMIN_LASTNAME,
  seed_admin_email: process.env.SEED_ADMIN_EMAIL,
  seed_admin_password: process.env.SEED_ADMIN_PASSWORD,
}));