/**
 * Service works with API
 */

import { Inject, Injectable } from '@angular/core'
import axios, { AxiosResponse } from 'axios'
import { isEmpty, uniq } from 'lodash'
import * as qs from 'qs'
import { Subject } from 'rxjs'
import * as io from 'socket.io-client'

import { Config, Environment, getConfig } from '../../config'
import { ApiEnvironment, API_ENVIRONMENT } from '../model'
import { AccountTypeId } from '../providers/account/entities'
import { CcrRol, CcrRolesMap } from '../providers/common/types'
import { LoginSessionResponse } from '../providers/session/responses'
import { ApiOptions } from './apiOptions.interface'
import { ApiOptionsModel } from './apiOptions.model'
import { HeaderOptions } from './headerOptions.interface'
import { locBase } from './i18n.config'

@Injectable({ providedIn: 'root' })
class ApiService {
  public apiUrl: string
  private account: CcrRol | undefined
  public config: Config
  private environment: Environment = 'test' // default value
  private headers: HeaderOptions = {}
  private token: string
  private langs: string
  private socketClient: io.SocketIOClient.Socket

  public onUnauthenticatedError = new Subject<boolean>()

  public constructor(@Inject(API_ENVIRONMENT) environment: ApiEnvironment) {
    this.apiUrl = environment.apiUrl
    this.headers = {
      appName: environment.appName,
      appVersion: environment.appVersion,
      cookieDomain: environment.cookieDomain
    }
    // this.setEnvironment(environment ? environment : this.environment)
  }

  public setAccount(type: AccountTypeId) {
    this.account = CcrRolesMap(type)
  }

  public doLogin(res: LoginSessionResponse): Promise<void> {
    if (res.accountType) {
      this.account = CcrRolesMap(res.accountType)
    }
    if (res.token) {
      this.setToken(res.token)
    }
    return Promise.resolve()
  }

  /**
   * Set current environment
   * @param environment string
   * @param baseUrl string
   */
  public setEnvironment(environment: Environment, baseUrl?: string): void {
    this.environment = environment
    this.config = getConfig(this.environment)
    this.config.apiUrl = baseUrl ? baseUrl : this.config.apiUrl
    this.apiUrl = (environment as any).apiUrl || baseUrl // MERGETODO: CHECK THIS TYPE!!!
    console.log('set environment: ', environment, baseUrl)
    try {
      window.localStorage.setItem('selvera-api[environment]', environment)
    } catch (e) {
      // console.error('Session token failed to set in localstorage', e);
    }
  }

  /**
   * Get current environment
   * @returns string
   */
  public getEnvironment(): Environment {
    return this.environment
  }

  /**
   * Get the current URL for an endpoint
   * @param path string
   * @param version string
   * @returns string
   */
  public getUrl(path = '/', version = '1.0') {
    return `${this.apiUrl}${version}${path}`
  }

  /**
   * Set app headers
   */
  public setLocales(locales: Array<string>) {
    const accepted: Array<string> = []
    const langs: any = {}

    // map the langs
    locales.map((locale) => {
      const base = locBase(locale)
      if (!langs.hasOwnProperty(base)) {
        langs[base] = []
      }
      langs[base].push(locale)
    })

    // build the Accept-Language header
    let quality = 1
    for (const row of uniq(Object.keys(langs))) {
      langs[row].push(row)
      accepted.push(`${uniq(langs[row]).join(', ')};q=${quality}`)
      quality -= 0.1
    }

    this.langs = accepted.length === 0 ? 'en' : accepted.join(', ')
  }

  public setOptionHeaders(headers: HeaderOptions): void {
    this.headers = Object.keys(headers).length < 1 ? {} : headers
  }

  public setToken(token: string): void {
    this.token = token
  }

  private getSocketClientConnection() {
    let tokenString = ''
    if (this.token) {
      tokenString = `SELVERA ${this.token}`
    } else {
      try {
        const localToken = window.localStorage.getItem('token')

        if (localToken !== undefined && localToken !== null) {
          tokenString = `SELVERA ${localToken}`
        }
      } catch (e) {
        // console.log(e)
      }
    }
    if (tokenString !== '') {
      return io(`${this.apiUrl}websocket`, {
        transportOptions: {
          polling: {
            extraHeaders: { authorization: tokenString }
          }
        }
      })
    } else {
      return io(`${this.apiUrl}websocket`)
    }
  }

  public getSocketClient(): io.SocketIOClient.Socket {
    return this.socketClient
      ? this.socketClient
      : this.getSocketClientConnection()
  }

  public rawRequest(apiOptions: any): Promise<any> {
    return new Promise((resolve, reject) => {
      axios
        .request(apiOptions)
        .then((response: AxiosResponse) => {
          try {
            if (typeof response.data === 'string') {
              response.data =
                response.data === '' ? {} : JSON.parse(response.data)
            }
            resolve(response.data)
          } catch (e) {
            reject('An error occurred reading response data')
          }
        })
        .catch((error: any) => {
          reject(error ? error : 'An error occurred')
        })
    })
  }

  public request(options: ApiOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options.data) {
        if (options.method === 'GET' || options.method === 'DELETE') {
          options.params = options.data
          options.paramsSerializer = (params: any) => {
            return qs.stringify(params)
          }
          delete options.data
        }
      }

      const apiOptions = new ApiOptionsModel(
        options,
        this.apiUrl,
        this.headers,
        this.token,
        this.account
      )

      // Accept-Language
      if (this.langs) {
        apiOptions.headers['Accept-Language'] = this.langs
      }

      axios
        .request(apiOptions)
        .then((response) => {
          if (response.status === 204) {
            resolve(true)
          } else if (response.status !== 200 && response.status !== 201) {
            reject(this.getError(response, 'An error occurred'))
          } else {
            try {
              if (typeof response.data === 'string') {
                response.data =
                  response.data === '' ? {} : JSON.parse(response.data)
              }
              resolve(response.data)
            } catch (e) {
              reject('An error occurred reading response data')
            }
          }
        })
        .catch((err) => {
          // TODO research on axios.CancelToken executor + rxjs
          try {
            if (err.response) {
              const response: AxiosResponse = err.response

              let defaultMsg
              switch (response.status) {
                case 401:
                  // this.onUnauthenticatedError.next(true);
                  // this.doLogout();
                  defaultMsg = 'You must be authenticated'
                  break
                case 403:
                  defaultMsg =
                    'You do not have proper permission to access this endpoint'
                  break
                case 404:
                  defaultMsg = 'Endpoint not found'
                  break
                case 409:
                  defaultMsg =
                    'The submitted data already exists in the database'
                  break
                default:
                  defaultMsg = 'An error occurred'
              }
              reject(
                apiOptions.fullError
                  ? response
                  : this.getError(response, defaultMsg)
              )
            } else {
              reject(
                apiOptions.fullError
                  ? err
                  : (err && err.message) || 'An error occurred'
              )
            }
          } catch {
            reject('An error occurred')
          }
        })
    })
  }

  private getError(response: AxiosResponse, defaultMsg: string) {
    if (response.data.errors) {
      return response.data.errors[0].message
    } else if (response.data.error) {
      return response.data.error
    }
    return response.data.message ? response.data.message : defaultMsg
  }

  private handleErrorCode(data: { code: string; message: string }): void {
    switch (data.code) {
      case 'mfa.invalid-token':
        // no action
        break
      default:
        // default action path, the most commonly used
        this.onUnauthenticatedError.next(true)
        this.token = ''
        break
    }
  }
}

export { ApiService }
