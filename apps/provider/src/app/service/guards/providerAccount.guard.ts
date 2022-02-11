import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { ContextService } from '../context.service'

@Injectable()
export class ProviderAccountGuard implements CanActivate {
  constructor(private context: ContextService, private router: Router) {}

  canActivate() {
    if (this.context.isProvider) {
      return true
    }

    return this.router.parseUrl('/dashboard')
  }
}
