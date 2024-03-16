import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AmoCrmService } from './amo-crm/amo-crm.service';
import { GetLastItem } from './pipes/get-last-item.pipe';
import { CheckSizePipe } from './pipes/check-size.pipe';
import { PipelineDto } from './dto/pipeline.dto';
import { GetLeadsResponse } from './types';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly amoCrmService: AmoCrmService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('leads')
  async getLeads(
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
  ): Promise<GetLeadsResponse> {
    return this.amoCrmService.getLeads({ query, page, limit });
  }

  @Get('pipelines')
  async getPipelines(): Promise<PipelineDto[]> {
    return this.amoCrmService.getPipelines();
  }
}
