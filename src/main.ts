import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { VersioningType } from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get("app.apiPrefix"), {
    exclude: ["/"]
  });
  app.enableVersioning({
    type: VersioningType.URI
  });

  const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('IzzUp API')
      .setDescription('The IzzUp API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get("app.port"));
}

void bootstrap();

