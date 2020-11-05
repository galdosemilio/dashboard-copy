import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  AuthAvailableResponse,
  Authentication,
  DeviceSyncResponse
} from '@coachcare/npm-api'

@Injectable()
export class DevicesDatabase extends CcrDatabase {
  constructor(private authentication: Authentication) {
    super()
  }

  available(dieterId: string): Promise<AuthAvailableResponse> {
    return this.authentication.available(dieterId)
  }

  lastActivity(dieterId: string): Promise<DeviceSyncResponse> {
    return this.authentication.lastActivity(dieterId)
  }
}
