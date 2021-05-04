import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import { PagedResponse, RPM } from '@coachcare/sdk'

@Injectable()
export class SupervisingProvidersDatabase implements CcrDatabase {
  constructor(private rpm: RPM) {}

  public fetch(request: any): Promise<PagedResponse<any>> {
    return this.rpm.getSupervisingProviders(request)
  }
}
