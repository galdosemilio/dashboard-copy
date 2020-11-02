import { ApiService } from '../../services/index';
import { MFASessionRequest, SessionRequest } from './requests';
import {
    EntityResponse,
    MFASessionResponse,
    SessionResponse
} from './responses';

/**
 * Session management
 */
class Session {
    /**
     * Init Api Service
     */
    public constructor(private readonly apiService: ApiService) {}

    /**
     * Login a user and either retreive token on success, or set cookie if requesting site is either admin, provider, or public site.
     * @param request must implement SessionLoginRequest
     * @returns Promise<SessionResponse>
     */
    public login(request: SessionRequest): Promise<SessionResponse> {
        return this.apiService.request({
            endpoint: '/login',
            method: 'POST',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Login a user and either retreive token on success, or set cookie if requesting site is either admin, provider, or public site.
     * @param request must implement MFASessionRequest
     * @returns Promise<MFASessionResponse>
     */
    public loginMFA(request: MFASessionRequest): Promise<MFASessionResponse> {
        return this.apiService.request({
            endpoint: '/login/mfa',
            method: 'POST',
            data: request,
            version: '2.0'
        });
    }

    /**
     * Session status check.
     * @returns Promise<EntityResponse>
     */
    public check(): Promise<EntityResponse> {
        return this.apiService.request({
            endpoint: '/session',
            method: 'GET',
            version: '2.0'
        });
    }

    /**
     * Logout the authenticated user.
     * @param token Session token
     * @returns Promise<void>
     */
    public logout(token?: string): Promise<void> {
        return this.apiService.request({
            endpoint: '/logout',
            method: 'POST',
            data: token ? { token } : undefined,
            version: '2.0'
        });
    }

    /**
     * Logout all user sessions.
     * @param account Account ID
     * @returns void
     */
    public logoutAll(account?: string): Promise<void> {
        return this.apiService.request({
            endpoint: '/logout/all',
            method: 'POST',
            data: account ? { account } : undefined,
            version: '2.0'
        });
    }
}

export { Session };
