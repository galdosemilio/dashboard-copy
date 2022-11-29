import { TableDataSource } from '@app/shared/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import {
  GetSupervisingProvidersRequest,
  NamedEntity,
  PagedResponse,
  SupervisingProviderAssociationItem
} from '@coachcare/sdk'
import { BehaviorSubject, from, Observable } from 'rxjs'
import { SupervisingProvidersDatabase } from './supervising-providers.database'

export class SupervisingProvidersDataSource extends TableDataSource<
  SupervisingProviderAssociationItem,
  PagedResponse<SupervisingProviderAssociationItem>,
  GetSupervisingProvidersRequest
> {
  public inheritedClinic: NamedEntity
  public isInherited: boolean
  public forceEmpty: boolean

  constructor(
    protected database: SupervisingProvidersDatabase,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex !== undefined
            ? this.paginator.pageIndex
            : this.pageIndex) *
          (this.paginator.pageSize !== undefined
            ? this.paginator.pageSize
            : this.pageSize)
      }))
    }
  }

  public defaultFetch(): PagedResponse<SupervisingProviderAssociationItem> {
    return { data: [], pagination: {} }
  }

  public fetch(
    request: GetSupervisingProvidersRequest
  ): Observable<PagedResponse<SupervisingProviderAssociationItem>> {
    return this.forceEmpty
      ? new BehaviorSubject({ data: [], pagination: {} })
      : from(this.database.fetch(request))
  }

  public mapResult(
    response: PagedResponse<SupervisingProviderAssociationItem>
  ): SupervisingProviderAssociationItem[] {
    this.getTotal(response)

    this.isInherited = response.data.some(
      (supervisingProvider) =>
        supervisingProvider.organization.id !== this.criteria.organization
    )

    this.inheritedClinic = this.isInherited
      ? response.data.find(
          (supervisingProvider) =>
            supervisingProvider.organization.id !== this.criteria.organization
        ).organization
      : { id: '', name: '' }

    return response.data
  }

  public removeInheritance(): void {
    this.isInherited = false
    this.change$.next()
    this.refresh()
  }
}
