import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  GetAllPackageEnrollmentRequest,
  GetAllPackageEnrollmentResponse,
  PackageEnrollment
} from '@coachcare/sdk'

@Injectable()
export class PhaseEnrollmentDatabase extends AppDatabase {
  constructor(private packageEnrollment: PackageEnrollment) {
    super()
  }

  public fetch(
    criteria: GetAllPackageEnrollmentRequest
  ): Promise<GetAllPackageEnrollmentResponse> {
    return this.packageEnrollment.getAll(criteria)
  }
}
