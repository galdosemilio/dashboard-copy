import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { ContextService } from './../context.service'

@Injectable()
export class OrphanedAccountGuard implements CanActivate {
  constructor(private context: ContextService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.context.isOrphaned && state.url.indexOf('profile') < 0) {
      void this.router.navigate(['/profile'])
      return false
    } else {
      return true
    }
  }
}
