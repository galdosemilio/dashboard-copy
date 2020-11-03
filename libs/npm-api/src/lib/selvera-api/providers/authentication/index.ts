import { ApiService } from '../../services/api.service';
import { AuthenticationService, SyncDate } from './entities';
import { AuthLevlRequest, SyncExternalDeviceRequest } from './requests';
import {
    AuthAvailableResponse,
    DeviceSyncResponse,
    OAuthResponse
} from './responses';

/**
 * Authentication handling (OAuth and Email/Password)
 */
class Authentication {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Gets a list of authentication tokens to 3rd party services for a specified account
     * @param accountId Account ID
     * @returns Promise<AuthAvailableResponse>
     */
    public available(accountId: string): Promise<AuthAvailableResponse> {
        return this.apiService.request({
            endpoint: `/authentication/${accountId}`,
            method: 'GET',
            data: accountId
        });
    }

    /**
     * Revokes a specific service's access to a specific account
     * @param accountId Account ID
     * @param service must be of type AuthenticationService
     * @returns Promise<boolean>
     */
    public revoke(
        accountId: string,
        service: AuthenticationService
    ): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/authentication/${accountId}/${service}`,
            method: 'DELETE'
        });
    }

    /**
     * Revokes all services' access to a specific account
     * @param accountId Account ID
     * @returns Promise<boolean>
     */
    public revokeAll(accountId: string): Promise<boolean> {
        return this.apiService.request({
            endpoint: `/authentication/${accountId}`,
            method: 'DELETE'
        });
    }

    /**
     * Fetches Fitbit's OAuth2 URL
     * @returns Promise<OAuthResponse>
     */
    public fitbit(): Promise<OAuthResponse> {
        return this.apiService.request({
            endpoint: '/authentication/fitbit',
            method: 'GET'
        });
    }

    /**
     * Fetches Google's OAuth2 URL
     * @returns Promise<OAuthResponse>
     */
    public google(): Promise<OAuthResponse> {
        return this.apiService.request({
            endpoint: '/authentication/google',
            method: 'GET'
        });
    }

    /**
     * Authenticates Levl user
     * @param data must implement AuthLevlRequest
     * @returns Promise<void>
     */
    public levl(data: AuthLevlRequest): Promise<void> {
        return this.apiService.request({
            endpoint: '/authentication/levl',
            method: 'POST',
            data: data
        });
    }

    /**
     * Authenticates Healthkit user
     * @returns Promise<void>
     */
    public healthKit(): Promise<void> {
        return this.apiService.request({
            endpoint: '/authentication/healthkit',
            method: 'POST'
        });
    }

    /**
     * Fetch authenticated and synced dates
     * @param account Account ID
     * @returns Promise<DeviceSyncResponse>
     */
    public lastActivity(account: string): Promise<DeviceSyncResponse> {
        return this.apiService.request({
            endpoint: `/measurement/device/sync`,
            method: 'GET',
            version: '2.0',
            data: {
                account
            }
        });
    }

    /**
     * Kick off the syncing process for a specified account & service/device for data in the provided date range.
     * Permissions: Client
     *
     * @param request must implement SyncExternalDeviceRequest
     * @return Promise<void>
     */
    public sync(request: SyncExternalDeviceRequest): Promise<void> {
        return this.apiService.request({
            endpoint: `/measurement/device/sync`,
            method: 'PUT',
            version: '2.0',
            data: request
        });
    }

    /**
     * Update last sync date for healthkit device
     * Permissions: Client
     *
     * @param request must implement SyncDate
     * @return Promise<void>
     */
    public syncHealthKit(request?: SyncDate): Promise<void> {
        return this.apiService.request({
            endpoint: `/measurement/device/sync/healthkit`,
            method: 'PUT',
            version: '2.0',
            data: request
        });
    }
}

export { Authentication };
