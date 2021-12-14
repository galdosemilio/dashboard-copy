import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { CcrRol } from '@coachcare/backend/shared'
import {
  SessionSelectors,
  SessionState
} from '@coachcare/backend/store/session'
import { AuthService } from '@coachcare/common/services'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map, skipWhile, take, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanLoad, CanActivate {
  /**
   * Login Page Guard
   */
  constructor(
    private router: Router,
    private store: Store<SessionState.State>,
    private auth: AuthService
  ) {}

  canLoad(route: Route): boolean | Observable<boolean> {
    if (route.path) {
      const account = route.path.split('/')[0]
      return this.store.pipe(
        select(SessionSelectors.selectSession),
        skipWhile((session) => !session.loaded),
        take(1),
        map((session) => {
          if (session.account !== account) {
            this.auth.logout()
          }
          return true
        })
      )
    } else {
      return true
    }
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(SessionSelectors.selectSession),
      tap((session) => {
        // if logged in redirect to the according site
        if (session.loggedIn) {
          switch (session.account) {
            case 'admin':
              void this.router.navigate([`/${session.account}`])
              break
            default:
              this.auth.login(session.account as CcrRol)
          }
        }
      }),
      map((session) => !session.loggedIn)
    )
  }
}
