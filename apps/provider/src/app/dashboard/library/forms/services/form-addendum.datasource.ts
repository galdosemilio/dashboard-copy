import { FormAddendumDatabase } from '@app/dashboard/library/forms/services/form-addendum.database';
import { NotifierService } from '@app/service';
import { CcrPaginator, TableDataSource } from '@app/shared';
import {
  CreateFormAddendumRequest,
  Entity,
  FormAddendumSingle,
  GetAllFormAddendumRequest,
  GetAllFormAddendumResponse
} from '@app/shared/selvera-api';
import { Observable } from 'rxjs';

export class FormAddendumDatasource extends TableDataSource<
  any,
  GetAllFormAddendumResponse,
  GetAllFormAddendumRequest
> {
  constructor(
    protected database: FormAddendumDatabase,
    private notify: NotifierService,
    private paginator: CcrPaginator
  ) {
    super();
    this.addOptional(this.paginator.page, () => ({
      limit: this.paginator.pageSize || this.pageSize,
      offset:
        (this.paginator.pageIndex || this.pageIndex) *
        (this.paginator.pageSize || this.pageSize)
    }));
  }

  createFormAddendum(args: CreateFormAddendumRequest): Promise<FormAddendumSingle> {
    return this.execRequest(this.database.create(args).toPromise());
  }

  defaultFetch(): GetAllFormAddendumResponse {
    return { data: [], pagination: {} };
  }

  fetch(args: GetAllFormAddendumRequest): Observable<GetAllFormAddendumResponse> {
    return this.database.fetch(args);
  }

  getFormAddendum(args: Entity): Promise<any> {
    return this.execRequest(this.database.getFormAddendum(args).toPromise());
  }

  mapResult(response: GetAllFormAddendumResponse): any {
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length;
    return response.data;
  }

  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true;
      this.change$.next();

      try {
        const response = await promise;
        resolve(response);
      } catch (error) {
        this.notify.error(error);
        reject(error);
      } finally {
        this.isLoading = false;
        this.change$.next();
      }
    });
  }
}
