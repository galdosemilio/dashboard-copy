/**
 * Service works with API
 */

import { Injectable } from '@angular/core'
import axios, { AxiosResponse } from 'axios'
import { isEmpty, uniq } from 'lodash'
import * as qs from 'qs'
import { Subject } from 'rxjs'
import * as io from 'socket.io-client'

import { Config, Environment, getConfig } from '../../config'
import { ApiOptions } from './apiOptions.interface'
import { ApiOptionsModel } from './apiOptions.model'
import { HeaderOptions } from './headerOptions.interface'
import { locBase } from './i18n.config'

@Injectable({ providedIn: 'root' })
class ApiService {
  public config: Config
  private environment: Environment = 'test' // default value
  private headers: HeaderOptions = {}
  private token: string
  private langs: string
  private socketClient: SocketIOClient.Socket

  public onUnauthenticatedError = new Subject<boolean>()

  public constructor() {
    let environment: any
    try {
      environment =
        window.localStorage.getItem('selvera-api[environment]') === null
          ? 'test'
          : window.localStorage.getItem('environment')
    } catch (e) {
      // console.log(e)
    }
    this.setEnvironment(environment ? environment : this.environment)
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
    return `${this.config.apiUrl}${version}${path}`
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

    try {
      window.localStorage.setItem('token', token)
    } catch (e) {
      // console.log(e)
    }
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
      return io(`${this.config.apiUrl}websocket`, {
        transportOptions: {
          polling: {
            extraHeaders: { authorization: tokenString }
          }
        }
      })
    } else {
      return io(`${this.config.apiUrl}websocket`)
    }
  }

  public getSocketClient(): SocketIOClient.Socket {
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

  /**
   * @param options Object with parameters. E.g `{endpoint: '/test', method: 'POST'}`
   * @returns Promise<any>
   */
  public request(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options.data) {
        if (options.method === 'GET') {
          options.params = options.data
          options.paramsSerializer = (params: any) => {
            return qs.stringify(params)
          }
          delete options.data
        }
      }
      options.environment = this.environment
      options.baseUrl = this.config.apiUrl

      const apiOptions = new ApiOptionsModel(options)

      // Accept-Language
      if (this.langs) {
        apiOptions.headers['Accept-Language'] = this.langs
      }

      // Add all custom headers to request - loop through all keys and convert camel case to dashes
      Object.keys(this.headers).forEach((key) => {
        apiOptions.headers[
          `x-selvera-${key
            .split(/(?=[A-Z])/g)
            .join('-')
            .toLowerCase()}`
        ] = (this.headers as any)[key]
      })

      if (this.token) {
        apiOptions.headers['Authorization'] = `SELVERA ${this.token}`
      } else {
        try {
          const localToken = window.localStorage.getItem('token')

          if (localToken !== undefined && localToken !== null) {
            this.setToken(String(localToken))
            apiOptions.headers['Authorization'] = `SELVERA ${localToken}`
          }
        } catch (e) {
          // console.log(e)
        }
      }

      if (isEmpty(apiOptions.data)) {
        delete apiOptions.data
      }

      axios
        .request(apiOptions as any)
        .then((response: AxiosResponse) => {
          let defaultMsg
          if (response.status === 401) {
            if (!response.data) {
              this.onUnauthenticatedError.next(true)
              this.token = ''
            } else {
              this.handleErrorCode(response.data)
            }
            defaultMsg = 'You must be authenticated'
            reject(this.getError(response, defaultMsg))
          } else if (response.status === 403) {
            defaultMsg =
              'You do not have proper permission to access this endpoint'
            reject(this.getError(response, defaultMsg))
          } else if (response.status === 404) {
            defaultMsg = 'Endpoint not found'
            reject(this.getError(response, defaultMsg))
          } else if (response.status === 409) {
            defaultMsg = 'The submitted data already exists in the database'
            reject(this.getError(response, defaultMsg))
          } else if (response.status === 204) {
            resolve(true)
          } else if (response.status !== 200 && response.status !== 201) {
            defaultMsg = 'An error occurred'
            reject(this.getError(response, defaultMsg))
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
        .catch((error: any) => {
          reject(error ? error : 'An error occurred')
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
