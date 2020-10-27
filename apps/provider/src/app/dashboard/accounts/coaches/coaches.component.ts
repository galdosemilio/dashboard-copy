import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatSort, Sort } from '@coachcare/common/material';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { STORAGE_COACHES_PAGINATION } from '@app/config';
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store';
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization,
} from '@app/service';
import { _, CcrPaginator } from '@app/shared';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AccountCreateDialog } from '../dialogs';
import { CoachesDatabase, CoachesDataSource } from './services';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss'],
  providers: [CoachesDatabase],
  encapsulation: ViewEncapsulation.None,
})
export class CoachesComponent implements AfterViewInit, OnInit, OnDestroy {
  source: CoachesDataSource | null;

  clinic: SelectedOrganization;

  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator;
  refresh$: Subject<void> = new Subject<void>();
  sort: MatSort = new MatSort();

  admin: boolean = false;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: CoachesDatabase,
    private store: Store<UILayoutState>
  ) {}

  ngAfterViewInit(): void {
    this.recoverPagination();
  }

  ngOnInit() {
    this.store.dispatch(new ClosePanel());

    // this.bus.trigger('organizations.enable-all');
    this.bus.trigger('right-panel.component.set', 'notifications');

    const errorHandler = function (err) {
      switch (err) {
        case 'You do not have proper permission to access this endpoint':
          this.addError(_('NOTIFY.ERROR.NO_COACH_LISTING_PERMISSION'));
          break;
        default:
          this.addError(err);
      }
    };

    // setup the table source
    this.source = new CoachesDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    );
    this.source.errorHandler = errorHandler;
    // add the clinics filter
    this.source.addRequired(
      this.context.organization$.pipe(delay(100)),
      () => ({
        organization: this.context.organizationId,
      })
    );
    this.source.addOptional(this.refresh$, () => ({}));
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (!result.length && this.paginator.pageIndex) {
          this.paginator.firstPage();
        }
      });

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org;
      this.admin = org && org.permissions ? org.permissions.admin : false;
      this.source.resetPaginator();
    });

    this.paginator.page.pipe(untilDestroyed(this)).subscribe((page) => {
      if (page.pageIndex > 0) {
        window.localStorage.setItem(
          STORAGE_COACHES_PAGINATION,
          JSON.stringify({
            page: page.pageIndex,
            organization: this.context.organizationId,
          })
        );
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new OpenPanel());
  }

  onSorted(sort: Sort): void {
    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.sort.sortChange.emit(sort);
  }

  createDialog() {
    if (!this.clinic.permissions.admin) {
      this.notifier.error(_('NOTIFY.ERROR.CANNOT_CREATE_ACCOUNTS'));
      return;
    }

    this.dialog
      .open(AccountCreateDialog, {
        data: {
          accountType: 'coach',
        },
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog',
      })
      .afterClosed()
      .subscribe((user) => {
        if (user) {
          this.notifier.success(_('NOTIFY.SUCCESS.COACH_CREATED'));
          this.source.refresh();
        }
      });
  }

  private recoverPagination(): void {
    const rawPagination = window.localStorage.getItem(
      STORAGE_COACHES_PAGINATION
    );
    if (rawPagination) {
      const pagination = JSON.parse(rawPagination);

      if (pagination.organization === this.context.organizationId) {
        this.paginator.pageIndex = pagination.page;
        this.source.pageIndex = pagination.page;
        this.cdr.detectChanges();
        this.refresh$.next();
      } else {
        window.localStorage.removeItem(STORAGE_COACHES_PAGINATION);
      }
    }
  }
}
