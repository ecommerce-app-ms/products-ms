import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { env } from 'process';

async function bootstrap() {
  const logger = new Logger('Products-Ms-Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.TCP,
      transport: Transport.NATS,
      options: {
        // port: envs.port,
        servers: envs.nastServers,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
  logger.log(` Products MicroService is running on port: ${envs.port}`);
}
bootstrap();
