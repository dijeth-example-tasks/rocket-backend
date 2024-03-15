import { Module } from '@nestjs/common';
import { AmoCrmService } from './amo-crm.service';

@Module({
  providers: [AmoCrmService]
})
export class AmoCrmModule {}
