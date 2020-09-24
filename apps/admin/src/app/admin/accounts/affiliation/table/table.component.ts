import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatSort } from '@coachcare/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDataSource, getterSorter } from '@coachcare/backend/model';
import {
  AccountSingle,
  AccountTypeId,
  AccountTypeIds
} from '@coachcare/backend/services';
import { _ } from '@coachcare/backend/shared';

@Component({
  selector: 'ccr-affiliated-accounts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffiliatedAccountsTableComponent implements OnInit, OnDestroy {
  @Input() columns = [];
  @Input() source: AppDataSource<any, any, any>;
  @Input() header = true;
  @Input() accountType: AccountTypeId;

  @Output() removeRecord = new EventEmitter<string>();

  @ViewChild(MatSort, { static: false })
  sort: MatSort;

  constructor(protected router: Router, protected route: ActivatedRoute) {}

  ngOnInit() {
    this.source.setSorter(this.sort, getterSorter(this.sort));

    this.source.showEmpty = () =>
      this.accountType === AccountTypeIds.Client
        ? _('NOTIFY.SOURCE.NO_ASSIGNED_CLIENTS')
        : _('NOTIFY.SOURCE.NO_ASSIGNED_PROVIDERS');
  }

  ngOnDestroy() {
    this.source.unsetSorter();
  }

  formatName(name: string) {
    return name.replace(/^.*?\s\-\s/, '');
  }

  onDisplay(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  onRemove(item: AccountSingle) {
    this.removeRecord.emit(item.id);
  }
}
