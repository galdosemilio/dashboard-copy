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
import { STORAGE_PATIENTS_PAGINATION } from '@app/config';
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization,
} from '@app/service';
import { _, CcrPaginator } from '@app/shared';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DietersDatabase, DietersDataSource } from '../services';

@Component({
  selector: 'dieter-listing-no-phi',
  templateUrl: './dieter-listing-no-phi.component.html',
  styleUrls: ['./dieter-listing-no-phi.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DieterListingNoPhiComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator;

  clinic: SelectedOrganization;
  csvSeparator = ',';
  dietersSource: DietersDataSource;
  refresh$: Subject<void> = new Subject<void>();
  sort: MatSort = new MatSort();

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: DietersDatabase
  ) {}

  ngAfterViewInit(): void {
    this.recoverPagination();
  }

  ngOnInit() {
    // this.bus.trigger('organizations.enable-all');
    this.bus.trigger('right-panel.component.set', 'notifications');

    const errorHandler = function (err) {
      switch (err) {
        case 'You do not have proper permission to access this endpoint':
          this.addError(_('NOTIFY.ERROR.NO_PATIENT_LISTING_PERMISSION'));
          break;
        default:
          this.addError(err);
      }
    };

    // setup the main patients table
    this.dietersSource = new DietersDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    );

    this.dietersSource.errorHandler = errorHandler;
    this.dietersSource.addRequired(
      this.context.organization$.pipe(delay(100)),
      () => ({
        organization: this.context.organizationId,
      })
    );
    this.dietersSource.addOptional(this.refresh$, () => ({}));
    this.dietersSource
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (!result.length && this.paginator.pageIndex) {
          this.paginator.firstPage();
        }
      });

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org;
      this.dietersSource.resetPaginator();
    });

    this.paginator.page.pipe(untilDestroyed(this)).subscribe((page) => {
      window.localStorage.setItem(
        STORAGE_PATIENTS_PAGINATION,
        JSON.stringify({
          page: page.pageIndex,
          organization: this.context.organizationId,
        })
      );
    });
  }

  ngOnDestroy() {
    this.dietersSource.disconnect();
  }

  onSorted(sort: Sort): void {
    this.sort.active = sort.active;
    this.sort.direction = sort.direction;
    this.sort.sortChange.emit(sort);
  }

  private recoverPagination(): void {
    const rawPagination = window.localStorage.getItem(
      STORAGE_PATIENTS_PAGINATION
    );
    if (rawPagination) {
      const pagination = JSON.parse(rawPagination);

      if (pagination.organization === this.context.organizationId) {
        this.paginator.pageIndex = pagination.page;
        this.dietersSource.pageIndex = pagination.page;
        this.cdr.detectChanges();
        this.refresh$.next();
      } else {
        window.localStorage.removeItem(STORAGE_PATIENTS_PAGINATION);
      }
    }
  }
}
