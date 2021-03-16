import { ApiService } from '../../services/index'
import { MFASessionRequest, SessionRequest } from './requests'
import {
  EntityResponse,
  LoginSessionResponse,
  MFASessionResponse
} from './responses'

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
  public login(request: SessionRequest): Promise<LoginSessionResponse> {
    return new Promise<LoginSessionResponse>(async (resolve, reject) => {
      try {
        const response: LoginSessionResponse = await this.apiService.request({
          endpoint: `/login`,
          method: 'POST',
          version: '2.0',
          data: request,
          fullError: true
        } as any) // MERGETODO: CHECK THIS TYPE!!!

        if (response.mfa) {
          resolve(response)
          return
        }

        await this.apiService.doLogin(response)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
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
    })
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
    })
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
    })
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
    })
  }
}

export { Session }
