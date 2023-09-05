import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatSort, Sort } from '@coachcare/material'
import Papa from 'papaparse'
import {
  ContextService,
  DietersCriteria,
  DietersDatabase,
  DietersDataSource,
  DietersService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { DieterListingItem, _ } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { delay } from 'rxjs/operators'
import { CSV } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'dieter-listing-no-phi',
  templateUrl: './dieter-listing-no-phi.component.html',
  styleUrls: ['./dieter-listing-no-phi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterListingNoPhiComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  clinic: SelectedOrganization
  dietersSource: DietersDataSource
  refresh$: Subject<void> = new Subject<void>()
  sort: MatSort = new MatSort()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: DietersDatabase,
    private dieters: DietersService
  ) {}

  ngAfterViewInit(): void {
    this.recoverFilters()
  }

  ngOnInit() {
    // this.bus.trigger('organizations.enable-all');
    this.bus.trigger('right-panel.component.set', 'notifications')

    const errorHandler = function (err) {
      switch (err) {
        case 'You do not have proper permission to access this endpoint':
          this.addError(_('NOTIFY.ERROR.NO_PATIENT_LISTING_PERMISSION'))
          break
        default:
          this.addError(err)
      }
    }

    // setup the main patients table
    this.dietersSource = new DietersDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    )

    this.dietersSource.errorHandler = errorHandler
    this.dietersSource.addRequired(
      this.context.organization$.pipe(delay(100)),
      () => ({
        organization: this.context.organizationId
      })
    )
    this.dietersSource.addOptional(this.refresh$, () => ({}))
    this.dietersSource
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (!result.length && this.paginator.pageIndex) {
          this.paginator.firstPage()
        }
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org
      this.dietersSource.resetPaginator()
    })

    this.paginator.page.pipe(untilDestroyed(this)).subscribe((page) => {
      this.dieters.storeFilters({
        page: page.pageIndex,
        organization: this.context.organizationId
      })
    })
  }

  ngOnDestroy() {
    this.dietersSource.disconnect()
  }

  async downloadCSV() {
    try {
      this.dietersSource.isLoading = true
      this.dietersSource.change$.next()

      await this.generateSingleCSV()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.dietersSource.isLoading = false
      this.dietersSource.change$.next()
    }
  }

  private async generateSingleCSV(): Promise<void> {
    try {
      const criteria: DietersCriteria = {
        ...this.dietersSource.args,
        limit: 'all',
        offset: 0,
        organization: this.context.organizationId
      }

      const res = await this.database.fetchAll(criteria)

      if (!res.data.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }

      const orgName = this.context.organization.name.replace(/\s/g, '_')
      const filename = `${orgName}_Patient_List.csv`
      let csv = 'PATIENT LIST\r\n'

      const data = res.data
        .map(
          (element: any) =>
            new DieterListingItem({
              ...element,
              ...element.account,
              organizations: element.organizations,
              orgCount: element.organizations.length
            })
        )
        .map((d) => {
          const organizationRows = {}

          for (let i = 0; i < 3; i += 1) {
            organizationRows[`Organization ID (${i + 1})`] = d.organizations[i]
              ? d.organizations[i].id
              : ''
            organizationRows[`Organization Name (${i + 1})`] = d.organizations[
              i
            ]
              ? d.organizations[i].name
              : ''
          }
          const row = {
            ID: d.id,
            'First Name': d.firstName,
            'Last Name': d.lastName,
            Email: d.email,
            ...organizationRows,
            'More Organization Associations?': d.orgCount > 3 ? 'Yes' : 'No'
          }

          return row
        })

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
      return Promise.resolve()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  onSorted(sort: Sort): void {
    this.sort.active = sort.active
    this.sort.direction = sort.direction
    this.sort.sortChange.emit(sort)
  }

  private recoverFilters(): void {
    const filters = this.dieters.recoverFilters()

    if (!filters) {
      return
    }

    this.paginator.pageIndex = filters.page
    this.dietersSource.pageIndex = filters.page
    this.cdr.detectChanges()
    this.refresh$.next()
  }
}
