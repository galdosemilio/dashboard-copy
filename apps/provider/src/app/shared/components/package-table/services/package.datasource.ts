import { ContextService } from '@app/service'
import { CcrPaginator } from '@app/shared/components'
import { TableDataSource } from '@app/shared/model'
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse,
  PackageAssociation,
  PackageOrganizationSingle
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { Package } from '../models'
import { PackageDatabase } from './package.database'

export class PackageDatasource extends TableDataSource<
  Package,
  GetAllPackageOrganizationResponse,
  GetAllPackageOrganizationRequest
> {
  public hasInheritedPackage = false

  constructor(
    protected context: ContextService,
    protected database: PackageDatabase,
    private paginator?: CcrPaginator
  ) {
    super()
    this.addDefault({
      organization: this.context.organization.id,
      isActive: true
    })
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }
  }

  disconnect() {}

  defaultFetch(): any {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllPackageOrganizationRequest
  ): Observable<GetAllPackageOrganizationResponse> {
    return this.database.fetch(criteria)
  }

  mapResult(result: GetAllPackageOrganizationResponse): Package[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    const resultArray: PackageAssociation[] = result.data || []
    const mappedResult = resultArray.map(
      (r: PackageOrganizationSingle) =>
        new Package(r.package, r, {
          organizationId: this.criteria.organization
        })
    )

    this.hasInheritedPackage = mappedResult.some((pkg) => pkg.isInherited)

    return mappedResult
  }

  // TODO: maybe create a parent class that holds this method? -- Zcyon
  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true
      this.change$.next()

      try {
        const response = await promise
        resolve(response)
      } catch (error) {
        reject(error)
      } finally {
        this.isLoading = false
        this.change$.next()
      }
    })
  }
}
