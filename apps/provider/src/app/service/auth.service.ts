import { Injectable } from '@angular/core'
import { STORAGE_PROVIDER_ROUTE } from '@app/config'
import { CookieService } from 'ngx-cookie-service'
import { AccountTypeIds, ApiService } from '@coachcare/sdk'
import { environment } from '../../environments/environment'
import { authenticationToken } from '@coachcare/common/sdk.barrel'
import { debounceTime } from 'rxjs/operators'
import { resolveHardcodedLoginSite } from './helpers'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(api: ApiService, private cookie: CookieService) {
    api.onUnauthenticatedError
      .pipe(debounceTime(500))
      .subscribe(() => this.redirect())
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

  redirect(strictLoginSite?: string): void {
    this.remove()

    const resolvedLoginSite = strictLoginSite
      ? strictLoginSite
      : resolveHardcodedLoginSite() ?? environment.loginSite

    window.localStorage[STORAGE_PROVIDER_ROUTE] = window.location.href
    window.location.href = environment.production
      ? resolvedLoginSite
      : 'http://localhost:4200'
  }
}
