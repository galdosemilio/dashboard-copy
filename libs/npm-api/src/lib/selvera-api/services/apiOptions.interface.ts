/**
 * Interface for api options
 */
import { Environment } from '../../config/environment.interface'

export interface ApiOptions {
  baseUrl?: string
  readonly endpoint?: string
  readonly url?: string
  readonly method?: string
  readonly version?: string
  data?: Object
  params?: Object
  paramsSerializer?(params: any): string
  responseType?: string
  readonly headers?: { [s: string]: string }
  readonly withCredentials?: boolean
  environment?: Environment
}
