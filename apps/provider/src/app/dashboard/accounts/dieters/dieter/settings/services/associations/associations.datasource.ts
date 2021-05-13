import { MatPaginator } from '@coachcare/material'
import { ContextService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  OrgAccessRequest,
  OrgAccessResponse,
  OrganizationAccess
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { AssociationsDatabase } from './associations.database'

export class AssociationsDataSource extends TableDataSource<
  OrganizationAccess,
  OrgAccessResponse,
  OrgAccessRequest
> {
  constructor(
    protected database: AssociationsDatabase,
    private context: ContextService,
    private paginator?: MatPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || 10,
        offset: this.paginator.pageIndex * this.paginator.pageSize || 0
      }))
    }
  }

  defaultFetch(): OrgAccessResponse {
    return { data: [], pagination: { totalCount: 0 } }
  }

  fetch(criteria: OrgAccessRequest): Observable<OrgAccessResponse> {
    return from(this.database.fetch(criteria))
  }

  async mapResult(result: OrgAccessResponse): Promise<OrganizationAccess[]> {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : (this.criteria.offset as number) + result.data.length

    const cleanResultData = []

    while (result.data.length) {
      const element = result.data.shift()
      cleanResultData.push({
        ...element,
        canDelete: await this.context.orgHasPerm(
          element.organization.id,
          'admin'
        )
      })
    }

    return cleanResultData
  }
}
