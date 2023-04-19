import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get("app.apiPrefix"), {
    exclude: ["/"]
  });
  app.enableVersioning({
    type: VersioningType.URI
  });
  await app.listen(configService.get("app.port"));
}

bootstrap();

