import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  APP_ENVIRONMENT,
  AppEnvironment,
  CcrRol
} from '@coachcare/common/shared'
import { ApiService } from '@coachcare/sdk'
import { authenticationToken } from '../sdk.barrel'
import { STORAGE_ADMIN_URL, STORAGE_PROVIDER_URL } from './cookie.service'

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private router: Router,
    private api: ApiService
  ) {
    // FIXME implement the unauthenticated listener
    // api.onUnauthenticatedError.subscribe(() => this.redirect());
  }

  login(role: CcrRol) {
    // TODO v7 get the requested Angular route and pass it to the login
    if (role === 'provider' || role === 'client') {
      const providerReturnURL =
        window.localStorage.getItem(STORAGE_PROVIDER_URL)
      window.localStorage.removeItem(STORAGE_PROVIDER_URL)
      // temporary redirect to ccr-staticProvider
      location.href =
        providerReturnURL ||
        (!this.environment.production ? 'http://localhost:4201' : '/provider')
    } else {
      this.api.appendHeaders({
        organization: null
      })
      const adminReturnUrl = window.localStorage.getItem(STORAGE_ADMIN_URL)
      window.localStorage.removeItem(STORAGE_ADMIN_URL)
      if (adminReturnUrl) {
        location.href = adminReturnUrl
      } else {
        void this.router.navigate([`/${role}`])
      }
    }
  }

  logout(): void {
    authenticationToken.value = undefined
    // FIXME why redirect to root from toolbar fails?
    void this.router.navigateByUrl('/').then((success) => {
      if (!success) {
        location.href = '/'
      }
    })
  }
}
