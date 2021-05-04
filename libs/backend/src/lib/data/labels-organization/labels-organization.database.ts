import { Injectable } from '@angular/core'
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse,
  PackageOrganization
} from '@coachcare/sdk'

@Injectable()
export class LabelsOrganizationDatabase {
  constructor(private packageOrganization: PackageOrganization) {}

  fetch(
    args: GetAllPackageOrganizationRequest
  ): Promise<GetAllPackageOrganizationResponse> {
    return this.packageOrganization.getAll(args)
  }
}
