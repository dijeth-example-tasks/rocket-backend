import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AmoCrm, AmoCrmPath } from '../const';
import { clearObject, generateFakeLead } from '../utils';
import {
  AmoCrmResponse,
  GetLeadsResponse,
  QueryParams,
  RawLead,
  RawPipeline,
  RawUser,
  ResponseEntity,
} from 'src/types';
import { LeadDto } from 'src/dto/lead.dto';
import { PipelineDto } from 'src/dto/pipeline.dto';
import { UserDto } from 'src/dto/user.dto';

const DEFAULT_QUERY: QueryParams = {
  query: '',
  page: 1,
  limit: 10,
};

const normalizeQuery = (queryParams: QueryParams): URLSearchParams => {
  const query = new URLSearchParams({
    ...DEFAULT_QUERY,
    ...clearObject(queryParams),
  } as Record<string, string>);

  query.set('order[id]', 'asc');

  return query;
};

@Injectable()
export class AmoCrmService {
  private httpClient: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.httpClient = axios.create({
      baseURL: config.get('SERVICE_API_URL'),
      headers: {
        Authorization: `Bearer ${config.get('LONG_TERM_ACCESS_TOKEN')}`,
      },
    });
  }

  private async requestOne<T>(path: string, id: number): Promise<T> {
    const response = await this.httpClient.get(`${path}/${id}`);
    return response.data;
  }

  private async request<K extends ResponseEntity, T>(
    path: string,
  ): Promise<AmoCrmResponse<K, T>> {
    const response = await this.httpClient.get(path);
    return response.data;
  }

  public async getLeads(queryParams: QueryParams): Promise<GetLeadsResponse> {
    const query = normalizeQuery(queryParams);
    const path = `${AmoCrmPath.GET_LEADS}?${query.toString()}`;

    const response = await this.request<'leads', RawLead[]>(path);

    if (!response) {
      return { leads: [], done: true };
    }

    const {
      _embedded: { leads },
      _links: { next },
    } = response;

    return { leads: leads.map((it) => new LeadDto(it)), done: !next };
  }

  public async getPipelines(): Promise<PipelineDto[]> {
    const response = await this.request<'pipelines', RawPipeline[]>(
      AmoCrmPath.GET_PIPELINES,
    );

    if (!response) {
      return [];
    }

    const {
      _embedded: { pipelines },
    } = response;

    return pipelines.map((it) => new PipelineDto(it));
  }

  public async getUser(id: number): Promise<UserDto> {
    try {
      const response = await this.requestOne<RawUser>(AmoCrmPath.GET_USERS, id);
      return response ? new UserDto(response) : null;
    } catch (err) {
      return null;
    }
  }

  public async getUsers(ids: number[]): Promise<UserDto[]> {
    const uniqueIds = Array.from(new Set(ids).values());
    const users = await Promise.all(uniqueIds.map((id) => this.getUser(id)));
    return users.filter(Boolean);
  }

  public async seedLeeds(count: number): Promise<void> {
    const leads = Array(Math.max(count, AmoCrm.MAX_CREATE_LEADS))
      .fill(0)
      .map(() => generateFakeLead());

    return this.httpClient.post('/leads/complex', leads);
  }
}
