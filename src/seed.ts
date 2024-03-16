import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AmoCrmService } from './amo-crm/amo-crm.service';
import { AmoCrm } from './const';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  return app.get(AmoCrmService);
}
bootstrap()
  .then((service) => service.seedLeeds(AmoCrm.MAX_CREATE_LEADS))
  .then(() => app.close())
  .then(() => {
    console.log('Done!');
  });
