import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AmoCrmModule } from './amo-crm/amo-crm.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      cache: true,
      load: [configuration],
    }),
    AmoCrmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
