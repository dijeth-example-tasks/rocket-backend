import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AmoCrm, AmoCrmPath } from '../const';
import { clearObject, generateFakeLead, generateFakeUser } from '../utils';
import {
  AmoCrmResponse,
  GetResponse,
  QueryParams,
  RawLead,
  RawPipeline,
  RawUser,
  ResponseEntity,
} from '../types';
import { LeadDto } from '../dto/lead.dto';
import { PipelineDto } from '../dto/pipeline.dto';
import { UserDto } from '../dto/user.dto';
import { StatusDto } from '../dto/status.dto';
import { faker } from '@faker-js/faker';
import { LeadWithUserDto } from '../dto/lead-with-user.dto';

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

const fetchAllPages = async function* <T>(
  fetchFn: (page: number) => Promise<GetResponse<T>>,
) {
  let page = 1;
  let response: GetResponse<T>;
  do {
    response = await fetchFn(page);
    page++;
    yield response.data;
  } while (!response.done);
  return;
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
    try {
      const response = await this.httpClient.get(`${path}/${id}`);
      return response.data;
    } catch (err) {
      throw new ServiceUnavailableException(err);
    }
  }

  private async request<K extends ResponseEntity, T>(
    path: string,
  ): Promise<AmoCrmResponse<K, T>> {
    try {
      const response = await this.httpClient.get(path);
      // throw new Error('Uuups');
      return response.data;
    } catch (err) {
      throw new ServiceUnavailableException(err);
    }
  }

  public async getLeads(
    queryParams: QueryParams,
  ): Promise<GetResponse<LeadDto[]>> {
    const query = normalizeQuery(queryParams);
    const path = `${AmoCrmPath.GET_LEADS}?${query.toString()}`;

    const response = await this.request<'leads', RawLead[]>(path);

    if (!response) {
      return { data: [], done: true };
    }

    const {
      _embedded: { leads },
      _links: { next },
    } = response;

    return { data: leads.map((it) => new LeadDto(it)), done: !next };
  }

  public async getfilledLeads(
    queryParams: QueryParams,
  ): Promise<GetResponse<LeadWithUserDto[]>> {
    const leadsResponse = await this.getLeads(queryParams);
    const userIds = leadsResponse.data.map(
      ({ responsibleUserId }) => responsibleUserId,
    );

    const users = await this.getUsers(userIds);
    const userDictionary = users.reduce(
      (acc, cur) => ({ ...acc, [cur.id]: cur }),
      {},
    );

    const leadsWithUser = leadsResponse.data.map(
      (it) => new LeadWithUserDto(it, userDictionary[it.responsibleUserId]),
    );

    return { done: leadsResponse.done, data: leadsWithUser };
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

  public async getStatuses(): Promise<{ [k: string]: StatusDto }> {
    const pipelines = await this.getPipelines();
    const statuses = pipelines.reduce(
      (acc, { statuses }) => [...acc, ...statuses],
      [],
    );

    return statuses.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cur,
      }),
      {},
    );
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

  public async getAllLeads(
    queryParams: Omit<QueryParams, 'page'>,
  ): Promise<LeadWithUserDto[]> {
    const leads: LeadWithUserDto[] = [];
    for await (const page of fetchAllPages<LeadWithUserDto[]>((p) => {
      const query = { ...queryParams, page: p };
      return this.getfilledLeads(query);
    })) {
      leads.push(...page);
    }
    return leads;
  }

  public async seedLeeds(count: number): Promise<void> {
    await this.seedUsers();

    const { users } = (await this.request<'users', RawUser[]>('/users'))
      ._embedded;

    const [pipeline] = await this.getPipelines();

    const leads = Array(Math.max(count, AmoCrm.MAX_CREATE_LEADS))
      .fill(0)
      .map(() => {
        const user = faker.helpers.arrayElement(users);
        const status = faker.helpers.arrayElement(pipeline.statuses);
        return generateFakeLead(user.id, pipeline.id, status.id);
      });

    return this.httpClient.post('/leads/complex', leads);
  }

  public async seedUsers(): Promise<void> {
    const users = Array(10)
      .fill(0)
      .map(() => generateFakeUser());

    await this.httpClient.post('/users', users);
  }
}
