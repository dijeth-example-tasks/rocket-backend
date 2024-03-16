import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AmoCrmModule } from './amo-crm/amo-crm.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), AmoCrmModule],
  controllers: [AppController],
})
export class AppModule {}
