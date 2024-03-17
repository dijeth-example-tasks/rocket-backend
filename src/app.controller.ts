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
import { UserDto } from './dto/user.dto';
import { UsersBodyValidation } from './pipes/users-body-validation.pipe';
import { GetUsersBodyDto } from './dto/get-uses-body.dto';
import { LeadDto } from './dto/lead.dto';
import { GetResponse, StatusDictionary } from './types';
import { FilledLeadDto } from './dto/lead-with-user.dto';

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
  ): Promise<GetResponse<LeadDto[]>> {
    return this.amoCrmService.getLeads({ query, page, limit });
  }

  @Get('filled-leads')
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

  @Get('all-leads')
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

  @Get('pipelines')
  async getPipelines(): Promise<PipelineDto[]> {
    return this.amoCrmService.getPipelines();
  }

  @Get('statuses')
  async getStatuses(): Promise<StatusDictionary> {
    return this.amoCrmService.getStatuses();
  }

  @Get('users')
  @UsePipes(new UsersBodyValidation())
  async getUsers(@Body() { ids }: GetUsersBodyDto): Promise<UserDto[]> {
    return this.amoCrmService.getUsers(ids);
  }
}
