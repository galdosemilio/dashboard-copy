import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import { CareManagementState, PagedResponse } from '@coachcare/sdk'

@Injectable()
export class SupervisingProvidersDatabase implements CcrDatabase {
  constructor(private careManagementState: CareManagementState) {}

  public fetch(request: any): Promise<PagedResponse<any>> {
    return this.careManagementState.getSupervisingProviders(request)
  }
}
