import { ContextService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import {
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse,
  PackageAssociation,
  PackageOrganizationSingle
} from '@coachcare/sdk'
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
    private paginator?: CcrPaginatorComponent
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
    this.getTotal(result)

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
