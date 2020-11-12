import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { ContextService } from './context.service'

@Injectable()
export class ConferenceGuard implements CanActivate {
  constructor(private context: ContextService) {}

  canActivate(): boolean {
    return this.context.organization.preferences.conference.enabled === true
  }
}
