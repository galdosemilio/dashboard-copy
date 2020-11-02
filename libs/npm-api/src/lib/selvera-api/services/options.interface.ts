/**
 * Interface for api options
 */

export interface ApiOptions {
  readonly endpoint?: string;
  readonly url?: string;
  readonly method?: string;
  readonly version?: string;
  data?: Object;
  params?: Object;
  paramsSerializer?: ((params: any) => string);
  headers?: { [header: string]: string };
  readonly withCredentials?: boolean;
  fullError?: boolean;
}
