import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { ContextService } from './context.service';

/**
 * Auth Guard
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private context: ContextService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.context.user !== undefined;
  }
}
