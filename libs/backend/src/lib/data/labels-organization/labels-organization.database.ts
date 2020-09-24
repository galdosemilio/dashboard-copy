import { Injectable } from '@angular/core';
import { PackageOrganization } from 'selvera-api';
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse
} from 'selvera-api/dist/lib/selvera-api/providers/package';

@Injectable()
export class LabelsOrganizationDatabase {
  constructor(private packageOrganization: PackageOrganization) {}

  fetch(args: GetAllPackageOrganizationRequest): Promise<GetAllPackageOrganizationResponse> {
    return this.packageOrganization.getAll(args);
  }
}
