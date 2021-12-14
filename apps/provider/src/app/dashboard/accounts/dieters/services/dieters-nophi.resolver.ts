import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { ContextService } from '../../../../service/context.service'

@Injectable()
export class DietersNoPhiGuard implements CanActivate {
  constructor(private context: ContextService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permissions = this.context.organization.permissions

    if (permissions && permissions.viewAll && permissions.allowClientPhi) {
      void this.router.navigate(['/accounts/patients'])
      return false
    } else {
      return true
    }
  }
}
