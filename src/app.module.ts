import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AmoCrmModule } from './amo-crm/amo-crm.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), AmoCrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
