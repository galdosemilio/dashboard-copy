import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  CountedPaginatedResponse,
  FetchPatientListingRequest,
  PatientListingItem
} from '@coachcare/npm-api'
import { Reports } from 'selvera-api'
import {
  PatientListingAssociationItem,
  PatientListingPackageEnrollmentItem
} from 'selvera-api/dist/lib/selvera-api/providers/reports/entities'
import {
  FetchPatientListingAssociationRequest,
  FetchPatientListingPackageEnrollmentsRequest
} from 'selvera-api/dist/lib/selvera-api/providers/reports/requests'

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
