import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'
import { PackageOrganization } from 'selvera-api'

@Injectable()
export class PackageDatabase extends CcrDatabase {
  constructor(private packageOrganization: PackageOrganization) {
    super()
  }

  fetch(
    args: GetAllPackageOrganizationRequest
  ): Observable<GetAllPackageOrganizationResponse> {
    return from(this.packageOrganization.getAll(args))
  }
}
