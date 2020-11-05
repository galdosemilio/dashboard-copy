/**
 * Model for API Options
 */

import { upperFirst } from 'lodash'
import { CcrRol } from '../model'
import { ApiHeaders } from './headers.interface'
import { ApiOptions } from './options.interface'
import { Method } from 'axios'

export class ApiOptionsModel implements ApiOptions {
  public readonly endpoint: string
  public readonly url: string
  public readonly method: Method
  public readonly version: string
  public data: Object
  public params: Object
  public paramsSerializer: ((params: any) => string) | undefined
  public headers: { [header: string]: string } = {}
  public readonly withCredentials: boolean | undefined = true
  public fullError = false

  /**
   * @param apiOptions {}
   * @returns void
   */
  public constructor(
    apiOptions: ApiOptions,
    apiUrl: string,
    headers: Partial<ApiHeaders>,
    token: string,
    account?: CcrRol
  ) {
    this.endpoint = apiOptions.endpoint || '/'
    this.method = apiOptions.method || ('GET' as Method)
    this.version = apiOptions.version || '1.0'
    this.data = apiOptions.data || {}
    this.params = apiOptions.params || {}
    this.paramsSerializer = apiOptions.paramsSerializer
    this.withCredentials = apiOptions.withCredentials || true
    this.fullError = apiOptions.fullError || false

    // TODO ensure the format with trim and join
    this.url = `${apiUrl}${this.version}${this.endpoint}`

    if (token) {
      this.headers['Authorization'] = `SELVERA ${token}`
    }

    Object.keys(headers).forEach((key) => {
      const header = upperFirst(key.split(/(?=[A-Z])/g).join('-'))
      this.headers[`X-Selvera-${header}`] = headers[key] as string
    })

    if (account) {
      this.headers[`X-Selvera-Account`] = account
    }
  }
}
