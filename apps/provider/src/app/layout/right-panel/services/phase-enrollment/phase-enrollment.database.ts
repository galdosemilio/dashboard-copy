import { Injectable } from '@angular/core'
import {
  GetAllPackageEnrollmentRequest,
  GetAllPackageEnrollmentResponse
} from '@coachcare/sdk'
import { PackageEnrollment } from '@coachcare/sdk'

@Injectable()
export class PhaseEnrollmentDatabase {
  constructor(private packageEnrollment: PackageEnrollment) {}

  public fetch(
    criteria: GetAllPackageEnrollmentRequest
  ): Promise<GetAllPackageEnrollmentResponse> {
    return this.packageEnrollment.getAll(criteria)
  }
}
