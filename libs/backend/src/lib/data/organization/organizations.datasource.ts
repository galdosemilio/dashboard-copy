import { Injectable } from '@angular/core'
import { SearchDataSource } from '@coachcare/backend/model'
import {
  OrgEntityExtended,
  OrgListSegment,
  OrgSingleResponse,
  PagedResponse
} from '@coachcare/sdk'
import { _, AutocompleterOption } from '@coachcare/backend/shared'
import { clone } from 'lodash'

import { from, Observable } from 'rxjs'
import { GetListSegment, OrganizationsCriteria } from './organization.types'
import { OrganizationsDatabase } from './organizations.database'

@Injectable()
export class OrganizationsDataSource extends SearchDataSource<
  any,
  any,
  OrganizationsCriteria
> {
  constructor(protected database: OrganizationsDatabase) {
    super()
  }

  defaultFetch(): PagedResponse<any> {
    return {
      data: [],
      pagination: {}
    }
  }

  defaultData(): PagedResponse<any> {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(criteria): Observable<PagedResponse<OrgEntityExtended>>
  // fetch(criteria): Observable<PagedResponse<OrgListSegment>>
  fetch(criteria: Partial<OrganizationsCriteria>) {
    const args = clone(criteria)
    delete args.isAdmin

    return !criteria.strict || criteria.isAdmin
      ? from(this.database.admin(args))
      : from(this.database.list(args))
  }

  search(query: string, limit: number) {
    // custom search parameters
    if (!this.criteria.strict || this.criteria.isAdmin) {
      this.refresh({ name: query, limit })
    } else {
      this.refresh({ query, limit })
    }
  }

  getSingle(id: string): Promise<OrgSingleResponse> {
    return this.database.single(id)
  }

  mapResult(result: PagedResponse<OrgEntityExtended>): Array<OrgEntityExtended>
  mapResult(result: PagedResponse<OrgListSegment>): Array<GetListSegment>
  mapResult(result) {
    // pagination handling
    this.getTotal(result)

    if (!this.criteria.isAdmin) {
      return result.data.map((segment: OrgListSegment) => ({
        ...segment.organization,
        permissions: segment.permissions,
        isDirect: segment.isDirect
      }))
    }

    return result.data
  }

  mapSearch(
    result: Array<OrgEntityExtended> | Array<GetListSegment>
  ): Array<AutocompleterOption>
  mapSearch(result) {
    // search handling
    if (this.criteria.isAdmin) {
      return result.map((org: OrgEntityExtended) => ({
        id: org.id,
        value: this.getRoute(org.id),
        viewValue: `${org.name}`,
        viewSubvalue: _('GLOBAL.ORGANIZATION'),
        viewNote: org.shortcode
      }))
    } else {
      return result.map((org: GetListSegment) => ({
        id: org.id,
        value: this.getRoute(org.id),
        viewValue: `${org.name}`,
        viewSubvalue: _('GLOBAL.ORGANIZATION'),
        viewNote: org.shortcode
      }))
    }
  }

  mapSingle(org: OrgEntityExtended | GetListSegment): AutocompleterOption {
    return {
      id: org.id,
      value: this.getRoute(org.id),
      viewValue: `${org.name}`,
      viewSubvalue: _('GLOBAL.ORGANIZATION'),
      viewNote: org.shortcode
    }
  }

  private getRoute(id: string) {
    // FIXME route according to the current site
    return `/admin/organizations/${id}`
  }
}
