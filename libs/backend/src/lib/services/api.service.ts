import { Inject, Injectable } from '@angular/core';
import {
  API_ENVIRONMENT,
  ApiEnvironment,
  CcrRol,
  CcrRolesMap
} from '@coachcare/backend/shared';
import axios, { AxiosResponse } from 'axios';
import { uniq } from 'lodash';
import * as qs from 'qs';

import { ApiHeaders } from './headers.interface';
import { ApiOptions } from './options.interface';
import { ApiOptionsModel } from './options.model';
import { LoginSessionResponse } from './providers';
import { AccountTypeId } from './shared';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private account: CcrRol | undefined;
  private apiUrl: string;
  private headers: Partial<ApiHeaders>;
  private token: string;
  private langs: string;

  constructor(@Inject(API_ENVIRONMENT) environment: ApiEnvironment) {
    this.apiUrl = environment.apiUrl;
    this.headers = {
      appName: environment.appName,
      appVersion: environment.appVersion,
      cookieDomain: environment.cookieDomain
    };
  }

  public setAccount(type: AccountTypeId) {
    this.account = CcrRolesMap(type);
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public doLogin(res: LoginSessionResponse): Promise<void> {
    if (res.accountType) {
      this.account = CcrRolesMap(res.accountType);
    }
    if (res.token) {
      this.setToken(res.token);
    }
    return Promise.resolve();
  }

  public doLogout() {
    this.account = undefined;
    this.setToken('');
  }

  /**
   * Get the current URL for an endpoint
   * @param path string
   * @param version string
   * @returns string
   */
  public getUrl(path = '/', version = '1.0') {
    return `${this.apiUrl}${version}${path}`;
  }

  /**
   * Set app headers
   */
  public setLocales(locales: Array<string>) {
    const accepted: Array<string> = [];
    const langs: any = {};

    // map the langs
    locales.map(locale => {
      const base = locale.split(/[-|_]/)[0];
      if (!langs.hasOwnProperty(base)) {
        langs[base] = [];
      }
      langs[base].push(locale);
    });
    langs['en'] = ['en'];

    // build the Accept-Language header
    let quality = 1;
    for (const row of uniq(Object.keys(langs))) {
      langs[row].push(row);
      accepted.push(`${uniq(langs[row]).join(', ')};q=${quality}`);
      quality -= 0.1;
    }

    this.langs = accepted.join(', ');
  }

  public request(options: ApiOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options.data) {
        if (options.method === 'GET' || options.method === 'DELETE') {
          options.params = options.data;
          options.paramsSerializer = (params: any) => {
            return qs.stringify(params);
          };
          delete options.data;
        }
      }

      const apiOptions = new ApiOptionsModel(
        options,
        this.apiUrl,
        this.headers,
        this.token,
        this.account
      );

      // Accept-Language
      if (this.langs) {
        apiOptions.headers['Accept-Language'] = this.langs;
      }

      axios
        .request(apiOptions as any)
        .then(response => {
          if (response.status === 204) {
            resolve(true);
          } else if (response.status !== 200 && response.status !== 201) {
            reject(this.getError(response, 'An error occurred'));
          } else {
            try {
              if (typeof response.data === 'string') {
                response.data =
                  response.data === '' ? {} : JSON.parse(response.data);
              }
              resolve(response.data);
            } catch (e) {
              reject('An error occurred reading response data');
            }
          }
        })
        .catch(err => {
          // TODO research on axios.CancelToken executor + rxjs
          try {
            if (err.response) {
              const response: AxiosResponse = err.response;

              let defaultMsg;
              switch (response.status) {
                case 401:
                  // this.onUnauthenticatedError.next(true);
                  // this.doLogout();
                  defaultMsg = 'You must be authenticated';
                  break;
                case 403:
                  defaultMsg =
                    'You do not have proper permission to access this endpoint';
                  break;
                case 404:
                  defaultMsg = 'Endpoint not found';
                  break;
                case 409:
                  defaultMsg =
                    'The submitted data already exists in the database';
                  break;
                default:
                  defaultMsg = 'An error occurred';
              }
              reject(
                apiOptions.fullError
                  ? response
                  : this.getError(response, defaultMsg)
              );
            } else {
              reject(
                apiOptions.fullError
                  ? err
                  : (err && err.message) || 'An error occurred'
              );
            }
          } catch {
            reject('An error occurred');
          }
        });
    });
  }

  private getError(response: AxiosResponse, defaultMsg: string) {
    if (response.data.errors) {
      return response.data.errors[0].message;
    } else if (response.data.error) {
      return response.data.error;
    }
    return response.data.message ? response.data.message : defaultMsg;
  }
}
