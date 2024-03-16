import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { AmoCrmService } from './amo-crm/amo-crm.service';
import { GetLastItem } from './pipes/get-last-item.pipe';
import { CheckSizePipe } from './pipes/check-size.pipe';
import { PipelineDto } from './dto/pipeline.dto';
import { GetLeadsResponse } from './types';
import { UserDto } from './dto/user.dto';
import { UsersBodyValidation } from './pipes/users-body-validation.pipe';
import { GetUsersBodyDto } from './dto/get-uses-body.dto';
import { StatusDto } from './dto/status.dto';

@Controller('api')
export class AppController {
  constructor(private readonly amoCrmService: AmoCrmService) {}

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

  @Get('statuses')
  async getStatuses(): Promise<{ [k: string]: StatusDto }> {
    return this.amoCrmService.getStatuses();
  }

  @Get('users')
  @UsePipes(new UsersBodyValidation())
  async getUsers(@Body() { ids }: GetUsersBodyDto): Promise<UserDto[]> {
    return this.amoCrmService.getUsers(ids);
  }
}
