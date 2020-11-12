import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { ContextService } from '../../../../service/context.service'

@Injectable()
export class DietersGuard implements CanActivate {
  constructor(private context: ContextService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permissions = this.context.organization.permissions

    if (permissions && (!permissions.allowClientPhi || !permissions.viewAll)) {
      this.router.navigate(['/accounts/patients/nophi'])
      return false
    } else {
      return true
    }
  }
}
