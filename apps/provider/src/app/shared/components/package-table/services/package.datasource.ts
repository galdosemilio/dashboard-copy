import { Package } from '@app/dashboard/content/models/package.model';
import { ContextService } from '@app/service';
import { CcrPaginator } from '@app/shared/components';
import { TableDataSource } from '@app/shared/model';
import {
  FetchPackageResponse,
  GetAllPackageOrganizationRequest,
  GetAllPackageOrganizationResponse,
  PackageOrganizationSingle
} from '@app/shared/selvera-api';
import { Observable } from 'rxjs';
import { PackageDatabase } from './package.database';

export class PackageDatasource extends TableDataSource<
  Package,
  GetAllPackageOrganizationResponse,
  any
> {
  constructor(
    protected context: ContextService,
    protected database: PackageDatabase,
    private paginator?: CcrPaginator
  ) {
    super();
    this.addDefault({ organization: this.context.organization.id, isActive: true });
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }));
    }
  }

  disconnect() {}

  defaultFetch(): any {
    return { data: [], pagination: {} };
  }

  fetch(
    criteria: GetAllPackageOrganizationRequest
  ): Observable<GetAllPackageOrganizationResponse> {
    return this.database.fetch(criteria);
  }

  mapResult(result: any): any[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length;

    const resultArray: any[] = result.data || [];
    return resultArray.map(
      (r: PackageOrganizationSingle) =>
        new Package({ ...r.package, organization: r.organization })
    );
  }

  // TODO: maybe create a parent class that holds this method? -- Zcyon
  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true;
      this.change$.next();

      try {
        const response = await promise;
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        this.isLoading = false;
        this.change$.next();
      }
    });
  }
}
