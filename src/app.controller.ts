import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AmoCrmService } from './amo-crm/amo-crm.service';
import { GetLastItem } from './pipes/get-last-item.pipe';
import { CheckSizePipe } from './pipes/check-size.pipe';
import { LeadDto } from './dto/lead.dto';
import { GetResponse } from './types';
import { FilledLeadDto } from './dto/lead-with-user.dto';

@Controller('api')
export class AppController {
  constructor(private readonly amoCrmService: AmoCrmService) {}

  @Get('paged-leads')
  async getFilledLeads(
    @Query('query', new GetLastItem<string>(), new CheckSizePipe(3))
    query?: string,

    @Query(
      'page',
      new GetLastItem<string>(),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,

    @Query(
      'limit',
      new GetLastItem<string>(),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ): Promise<GetResponse<FilledLeadDto[]>> {
    return this.amoCrmService.getFilledLeads({ query, page, limit });
  }

  @Get('leads')
  async getAllLeads(
    @Query('query', new GetLastItem<string>(), new CheckSizePipe(3))
    query?: string,

    @Query(
      'limit',
      new GetLastItem<string>(),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
  ): Promise<LeadDto[]> {
    return this.amoCrmService.getAllLeads({ query, limit });
  }
}
