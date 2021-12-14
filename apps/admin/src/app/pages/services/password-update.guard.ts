import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class PasswordUpdateGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // eslint-disable-next-line max-len
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (
      !route.queryParams.code ||
      !route.queryParams.email ||
      !emailRegex.test(route.queryParams.email)
    ) {
      // FIXME show an error message?
      void this.router.navigate(['/'])
      return false
    }

    return true
  }
}
