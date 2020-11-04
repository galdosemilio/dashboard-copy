import { TableDataSource } from '@coachcare/backend/model'
import { from, Observable } from 'rxjs'
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse,
  PackageAssociation
} from '@coachcare/npm-api'
import { LabelsOrganizationDatabase } from './labels-organization.database'

export interface PackageAssociationElement extends PackageAssociation {
  inherited?: boolean
  selectorValue?: 'enabled' | 'disabled'
}

export class LabelsOrganizationDataSource extends TableDataSource<
  PackageAssociationElement,
  GetAllPackageOrganizationResponse,
  GetAllPackageOrganizationRequest
> {
  public showMarker: boolean

  constructor(protected database: LabelsOrganizationDatabase) {
    super()
  }

  defaultFetch(): GetAllPackageOrganizationResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllPackageOrganizationRequest
  ): Observable<GetAllPackageOrganizationResponse> {
    return from(this.database.fetch(criteria))
  }

  mapResult(
    response: GetAllPackageOrganizationResponse
  ): PackageAssociationElement[] {
    // pagination handling
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + response.data.length
      : 0

    const result: PackageAssociationElement[] = response.data.map(
      (element) => ({
        ...element,
        inherited: element.organization.id !== this.criteria.organization
      })
    )

    result.forEach(
      (element) =>
        (element.selectorValue = element.isActive ? 'enabled' : 'disabled')
    )

    this.showMarker = result.some((v) => v.inherited)

    return result
  }
}
