import { Injectable } from '@angular/core';
import { SessionActions, SessionState } from '@coachcare/backend/store/session';
import { Store } from '@ngrx/store';
import { ApiService } from '../../api.service';
import { Entity } from '../../shared';
import { Account } from '../account';
import {
  LoginSessionRequest,
  LogoutAllSessionRequest,
  LogoutSessionRequest,
  MFASessionRequest
} from './requests';
import { LoginSessionResponse, MFASessionResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Session {
  public constructor(
    private readonly store: Store<SessionState.State>,
    private readonly apiService: ApiService,
    private readonly account: Account
  ) {}

  /**
   * Login a user and either retrieve token on success, or set cookie if requesting site is either admin, provider,
   * or public site.
   * For cookie-based authentication, keep in mind that a single web-browser can be logged into multiple sites at the same time.
   * As such, cookie-based calls must also include a header 'x-selvera-account', which must be set to either.
   * (admin|provider|client). The API will use the appropriate cookie based on the header value.
   * Additionally, a 'x-selvera-cookie-domain' header allows user to define domain.
   * Once logged in, all requests are properly authenticated and user types verified as needed.
   * on which cookie is set, but domain must be in CORS_WHITELIST.
   * Permissions: Public
   *
   * @param request must implement LoginSessionRequest
   * @return Promise<LoginSessionResponse>
   */
  public login(request: LoginSessionRequest): Promise<LoginSessionResponse> {
    return new Promise<LoginSessionResponse>(async (resolve, reject) => {
      try {
        const response: LoginSessionResponse = await this.apiService.request({
          endpoint: `/login`,
          method: 'POST',
          version: '2.0',
          data: request,
          fullError: true
        });

        if (response.mfa) {
          resolve(response);
          return;
        }

        await this.apiService.doLogin(response);
        const checkResponse = await this.check();

        const account = await this.account.getSingle(checkResponse);
        this.store.dispatch(new SessionActions.Login(account));
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Logout all user sessions.
   * Permissions: Admin, Client
   *
   * @param [request] must implement LogoutAllSessionRequest
   * @return Promise<void>
   */
  public logoutAll(request?: LogoutAllSessionRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/logout/all`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Logout the authenticated user.
   *
   * @param [request] must implement LogoutSessionRequest
   * @return Promise<void>
   */
  public logout(request?: LogoutSessionRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/logout`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Retrieves the account ID of the user associated with session on the request.
   *
   * @return Promise<Entity>
   */
  public check(): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/session`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Login a user and either retreive token on success, or set cookie if requesting site is either admin, provider, or public site.
   * @param request must implement MFASessionRequest
   * @returns Promise<MFASessionResponse>
   */
  public loginMFA(request: MFASessionRequest): Promise<MFASessionResponse> {
    return new Promise<MFASessionResponse>(async (resolve, reject) => {
      try {
        const response = await this.apiService.request({
          endpoint: '/login/mfa',
          method: 'POST',
          data: request,
          version: '2.0'
        });

        await this.apiService.doLogin(response);
        const checkResponse = await this.check();

        const account = await this.account.getSingle(checkResponse);
        this.store.dispatch(new SessionActions.Login(account));
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}
