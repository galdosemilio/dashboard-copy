import axios from 'axios'
import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import { AppRedirectRequest, FetchAppleIdRequest } from './requests'
import {
  AppRedirectResponse,
  AppStoreLookupResponse,
  AppStoreResource,
  GetAndroidRedirectMobileAppResponse,
  GetiOSRedirectMobileAppResponse
} from './responses'

/**
 * Mobile App Queries
 */
class MobileApp {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Redirect to App Store/iTunes
   * @param getAppRedirect must implement AppRedirectRequest
   * @returns Promise<AppRedirectResponse>
   */
  public getAppRedirect(
    getAppRedirect: AppRedirectRequest
  ): Promise<AppRedirectResponse> {
    return this.apiService.request({
      endpoint: `/app/${getAppRedirect.platform}/${getAppRedirect.organization}`,
      method: 'GET'
    })
  }

  /**
   * Fetch AppId from the Apple's Server
   * For information about the API see the {@link https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/#lookup iTunes Search API Documentation}
   * @param data must implement FetchAppleIdRequest
   * @returns Promise<string>
   */
  public fetchAppleId(
    fetchAppleIdRequest: FetchAppleIdRequest
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .request({
          url: `http://itunes.apple.com/lookup?bundleId=${fetchAppleIdRequest.bundleId}`,
          method: 'GET'
        })
        .then((response) => {
          if (response.status === 200) {
            const data: AppStoreLookupResponse = response.data
            try {
              if (data.resultCount >= 1) {
                resolve(data.results[0].trackId.toString())
              } else {
                reject('Application bundle not found in the AppStore')
              }
            } catch (error) {
              reject('An error occurred reading response data')
            }
          } else {
            reject('iTunes server rejected the request')
          }
        })
        .catch((error: any) => {
          reject(error ? error : 'An error occurred')
        })
    })
  }

  public fetchAppleAppData(
    fetchAppleIdRequest: FetchAppleIdRequest
  ): Promise<AppStoreResource> {
    return new Promise((resolve, reject) => {
      axios
        .request({
          url: `http://itunes.apple.com/lookup?bundleId=${fetchAppleIdRequest.bundleId}`,
          method: 'GET'
        })
        .then((response) => {
          if (response.status === 200) {
            const data: AppStoreLookupResponse = response.data
            try {
              if (data.resultCount >= 1) {
                resolve(data.results[0])
              } else {
                reject('Application bundle not found in the AppStore')
              }
            } catch (error) {
              reject('An error occurred reading response data')
            }
          } else {
            reject('iTunes server rejected the request')
          }
        })
        .catch((error: any) => {
          reject(error ? error : 'An error occurred')
        })
    })
  }

  /**
   * Redirect to iOS application for given organization.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<GetiOSRedirectMobileAppResponse>
   */
  public getiOsRedirect(
    request: Entity
  ): Promise<GetiOSRedirectMobileAppResponse> {
    return this.apiService.request({
      endpoint: `/app/ios/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Redirect to Android application for given organization.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<GetAndroidRedirectMobileAppResponse>
   */
  public getAndroidRedirect(
    request: Entity
  ): Promise<GetAndroidRedirectMobileAppResponse> {
    return this.apiService.request({
      endpoint: `/app/android/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }
}

export { MobileApp }
