import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app')!;

  // Enable CORS for frontend
  app.enableCors({
    origin: appConfig.frontendUrl,
    credentials: true,
  });

  await app.listen(appConfig.port);
  console.log(
    `🚀 Backend server running on http://localhost:${appConfig.port}`,
  );
  console.log(`📦 Environment: ${appConfig.nodeEnv}`);
}
bootstrap();
