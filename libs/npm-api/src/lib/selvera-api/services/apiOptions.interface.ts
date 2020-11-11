/**
 * Interface for api options
 */
import { Environment } from '../../config/environment.interface'
import { Method, ResponseType } from 'axios'

export interface ApiOptions {
  baseUrl?: string
  readonly endpoint?: string
  readonly url?: string
  readonly method?: Method
  readonly version?: string
  data?: Object
  params?: Object
  paramsSerializer?(params: any): string
  responseType?: ResponseType
  readonly headers?: { [s: string]: string }
  readonly withCredentials?: boolean
  environment?: Environment
  fullError?: boolean
}
