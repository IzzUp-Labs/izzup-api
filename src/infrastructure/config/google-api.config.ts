import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("google-api", () => ({
  google_api_key: process.env.GOOGLE_API_KEY
}));
