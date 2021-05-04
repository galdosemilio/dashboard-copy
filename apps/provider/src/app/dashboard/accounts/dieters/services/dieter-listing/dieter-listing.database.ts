import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  CountedPaginatedResponse,
  FetchPatientListingRequest,
  PatientListingItem,
  PatientListingAssociationItem,
  PatientListingPackageEnrollmentItem,
  FetchPatientListingAssociationRequest,
  FetchPatientListingPackageEnrollmentsRequest
} from '@coachcare/sdk'
import { Reports } from '@coachcare/sdk'

@Injectable()
export class DieterListingDatabase extends CcrDatabase {
  constructor(private reports: Reports) {
    super()
  }

  fetch(
    criteria: FetchPatientListingRequest
  ): Promise<CountedPaginatedResponse<PatientListingItem>> {
    return this.reports.fetchPatientListing(criteria)
  }

  fetchMoreOrgs(
    criteria: FetchPatientListingAssociationRequest
  ): Promise<CountedPaginatedResponse<PatientListingAssociationItem>> {
    return this.reports.fetchPatientListingAssociation(criteria)
  }

  fetchMorePackages(
    criteria: FetchPatientListingPackageEnrollmentsRequest
  ): Promise<CountedPaginatedResponse<PatientListingPackageEnrollmentItem>> {
    return this.reports.fetchPatientListingPackageEnrollments(criteria)
  }
}
