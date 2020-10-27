import { Injectable } from '@angular/core';
import {
  GetAllPackageEnrollmentRequest,
  GetAllPackageEnrollmentResponse
} from '@app/shared/selvera-api';
import { PackageEnrollment } from 'selvera-api';

@Injectable()
export class PhaseEnrollmentDatabase {
  constructor(private packageEnrollment: PackageEnrollment) {}

  public fetch(
    criteria: GetAllPackageEnrollmentRequest
  ): Promise<GetAllPackageEnrollmentResponse> {
    return this.packageEnrollment.getAll(criteria);
  }
}
