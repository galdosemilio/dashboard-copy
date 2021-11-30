import { Injectable } from '@angular/core'
import { STORAGE_PROVIDER_ROUTE } from '@app/config'
import { CookieService } from 'ngx-cookie-service'
import { AccountTypeIds, ApiService } from '@coachcare/sdk'
import { environment } from '../../environments/environment'
import { authenticationToken } from '@coachcare/common/sdk.barrel'

@Injectable()
export class AuthService {
  constructor(api: ApiService, private cookie: CookieService) {
    api.onUnauthenticatedError.subscribe(() => this.redirect())
  }

  check(): AccountTypeIds | false {
    const role = this.cookie.get('ccrStatic')
    switch (role) {
      case 'provider':
        return AccountTypeIds.Provider

      case 'client':
        return AccountTypeIds.Client

      default:
        return false
    }
  }

  get(): string {
    return this.cookie.get('ccrStatic')
  }

  remove(): void {
    authenticationToken.value = undefined
    this.cookie.delete('ccrStatic', '/')
  }

  redirect(): void {
    this.remove()
    window.localStorage[STORAGE_PROVIDER_ROUTE] = window.location.href
    window.location.href = environment.loginSite
  }
}
