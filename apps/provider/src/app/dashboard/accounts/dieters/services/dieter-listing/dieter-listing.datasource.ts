import { CcrPaginator, ExpandatableTableHeader, TableDataSource } from '@app/shared';
import {
  CountedPaginatedResponse,
  FetchPatientListingRequest,
  PatientListingItem
} from '@app/shared/selvera-api';
import { _ } from '@app/shared/utils';
import { from, Observable } from 'rxjs';
import {
  DieterListingItem,
  DieterListingOrgItem,
  DieterListingPackageItem
} from '../../models';
import { DieterListingDatabase } from './dieter-listing.database';

export class DieterListingDataSource extends TableDataSource<
  | DieterListingItem
  | DieterListingOrgItem
  | DieterListingPackageItem
  | ExpandatableTableHeader,
  CountedPaginatedResponse<PatientListingItem>,
  FetchPatientListingRequest
> {
  totalCount: number;

  constructor(
    protected database: DieterListingDatabase,
    private paginator?: CcrPaginator
  ) {
    super();

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }));
    }
  }

  defaultFetch(): CountedPaginatedResponse<PatientListingItem> {
    return { data: [], pagination: { totalCount: 0 } };
  }

  fetch(
    criteria: FetchPatientListingRequest
  ): Observable<CountedPaginatedResponse<PatientListingItem>> {
    return from(this.database.fetch(criteria));
  }

  mapResult(
    response: CountedPaginatedResponse<PatientListingItem>
  ): (DieterListingItem | DieterListingOrgItem | DieterListingPackageItem)[] {
    this.totalCount = response.pagination.totalCount;

    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length;

    const rows: (
      | DieterListingItem
      | DieterListingOrgItem
      | DieterListingPackageItem
    )[] = [];

    response.data.forEach((item) => {
      const dieterListingItem = new DieterListingItem({
        ...item.account,
        weight: item.weight || undefined,
        level: 0
      });
      rows.push(dieterListingItem);

      if (item.organizations && item.organizations.count > 0) {
        const organizationsHeader: ExpandatableTableHeader = {
          name: _('GLOBAL.ASSIGNED_CLINICS'),
          level: 1,
          isEmpty: false,
          isExpanded: false,
          isHidden: true
        };

        dieterListingItem.organizations.push(organizationsHeader as any);
        dieterListingItem.orgCount = item.organizations.data.length;

        item.organizations.data.forEach((org) => {
          dieterListingItem.organizations.push(
            new DieterListingOrgItem({
              ...org,
              level: 2,
              isEmpty: false,
              isExpanded: false,
              isHidden: true
            })
          );
        });

        if (item.organizations.count > item.organizations.data.length) {
          const loadOrganizations = {
            id: dieterListingItem.id,
            name: 'load-more-orgs',
            level: 2,
            isEmpty: false,
            isExpanded: false,
            isHidden: true
          };
          dieterListingItem.organizations.push(loadOrganizations as any);
        }

        rows.push(...dieterListingItem.organizations);
      }

      if (item.packages && item.packages.count > 0) {
        const packagesHeader: ExpandatableTableHeader = {
          name: _('GLOBAL.ENROLLED_PACKAGES'),
          level: 1,
          isEmpty: false,
          isExpanded: false,
          isHidden: true
        };

        dieterListingItem.packages.push(packagesHeader as any);
        dieterListingItem.packageCount = item.packages.data.length;

        item.packages.data.forEach((pkg) => {
          dieterListingItem.packages.push(
            new DieterListingPackageItem({
              ...pkg,
              level: 2,
              isEmpty: false,
              isExpanded: false,
              isHidden: true
            })
          );
        });

        if (item.packages.count > item.packages.data.length) {
          const loadPackages = {
            id: dieterListingItem.id,
            name: 'load-more-pkgs',
            level: 2,
            isEmpty: false,
            isExpanded: false,
            isHidden: true
          };
          dieterListingItem.packages.push(loadPackages as any);
        }

        rows.push(...dieterListingItem.packages);
      }

      rows[rows.length - 1].isLastOfGroup = true;

      let subItems: number = 0;

      if (dieterListingItem.packages.length > 0) {
        subItems += dieterListingItem.packages.length;
      }

      if (dieterListingItem.organizations.length > 0) {
        subItems += dieterListingItem.organizations.length;
      }

      if (subItems % 2 !== 0) {
        rows.push({ ...dieterListingItem, isHidden: true });
      }
    });

    return rows;
  }
}
