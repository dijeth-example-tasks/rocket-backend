export interface RawLead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  status_id: number;
  pipeline_id: number;
  created_at: number;
}

export interface RawStatus {
  id: number;
  name: string;
}

export interface RawPipeline {
  id: number;
  name: string;
  _embedded: {
    statuses: RawStatus[];
  };
}

export interface RawUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  'rights[is_free]'?: boolean;
}

export type ResponseEntity = 'leads' | 'pipelines' | 'users';

export interface AmoCrmResponse<K extends ResponseEntity, T> {
  _page?: number;
  _links: {
    self: {
      href: string;
    };
    prev?: {
      href: string;
    };
    next?: {
      href: string;
    };
    first?: {
      href: string;
    };
  };
  _embedded: {
    [key in K]: T;
  };
}

export interface GetResponse<T> {
  data: T;
  done: boolean;
}

export type QueryParams = {
  query?: string;
  page?: number;
  limit?: number;
};
