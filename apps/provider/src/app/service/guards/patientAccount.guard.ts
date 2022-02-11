import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { ContextService } from '../context.service'

@Injectable()
export class PatientAccountGuard implements CanActivate {
  constructor(private context: ContextService, private router: Router) {}

  canActivate() {
    if (this.context.isPatient) {
      return true
    }

    return this.router.parseUrl('/dashboard')
  }
}
