/**
 * Interface for api options
 */
import { Method } from 'axios'

export interface ApiOptions {
  readonly endpoint?: string
  readonly url?: string
  readonly method?: Method
  readonly version?: string
  data?: Object
  params?: Object
  paramsSerializer?: (params: any) => string
  headers?: { [header: string]: string }
  readonly withCredentials?: boolean
  fullError?: boolean
}
