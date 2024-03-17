import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AmoCrmService } from './amo-crm/amo-crm.service';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  return app.get(AmoCrmService);
}

bootstrap()
  .then((service) => service.seedLeeds(50))
  .then(() => app.close())
  .then(() => {
    console.log('Done!');
  })
  .catch((err) => console.log(err));
