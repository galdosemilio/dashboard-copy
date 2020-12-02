import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { MatSort, Sort } from '@coachcare/material'
import { STORAGE_PATIENTS_PAGINATION } from '@app/config'
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, CcrPaginator } from '@app/shared'
import { DieterListingItem } from '../models'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { delay } from 'rxjs/operators'
import { DietersDatabase, DietersDataSource } from '../services'
import { DietersCriteria } from '../services/dieters.criteria'

@UntilDestroy()
@Component({
  selector: 'dieter-listing-no-phi',
  templateUrl: './dieter-listing-no-phi.component.html',
  styleUrls: ['./dieter-listing-no-phi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterListingNoPhiComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator

  clinic: SelectedOrganization
  csvSeparator = ','
  dietersSource: DietersDataSource
  refresh$: Subject<void> = new Subject<void>()
  sort: MatSort = new MatSort()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: DietersDatabase
  ) {}

  ngAfterViewInit(): void {
    this.recoverPagination()
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
      window.localStorage.setItem(
        STORAGE_PATIENTS_PAGINATION,
        JSON.stringify({
          page: page.pageIndex,
          organization: this.context.organizationId
        })
      )
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
      let csv = ''
      csv += 'PATIENT LIST\r\n'
      csv +=
        'ID' +
        this.csvSeparator +
        'First Name' +
        this.csvSeparator +
        'Last Name' +
        this.csvSeparator +
        'Email' +
        this.csvSeparator +
        'Organization ID (1)' +
        this.csvSeparator +
        'Organization Name (1)' +
        this.csvSeparator +
        'Organization ID (2)' +
        this.csvSeparator +
        'Organization Name (2)' +
        this.csvSeparator +
        'Organization ID (3)' +
        this.csvSeparator +
        'Organization Name (3)' +
        this.csvSeparator +
        'More Organization Associations?' +
        '\r\n'

      res.data
        .map(
          (element: any) =>
            new DieterListingItem({
              ...element,
              ...element.account,
              organizations: element.organizations,
              orgCount: element.organizations.length
            })
        )
        .forEach((d) => {
          csv +=
            `"${d.id}"` +
            this.csvSeparator +
            `"${d.firstName}"` +
            this.csvSeparator +
            `"${d.lastName}"` +
            this.csvSeparator +
            `"${d.email}"` +
            this.csvSeparator +
            `"${d.organizations[0] ? d.organizations[0].id : ''}"` +
            this.csvSeparator +
            `"${d.organizations[0] ? d.organizations[0].name : ''}"` +
            this.csvSeparator +
            `"${d.organizations[1] ? d.organizations[1].id : ''}"` +
            this.csvSeparator +
            `"${d.organizations[1] ? d.organizations[1].name : ''}"` +
            this.csvSeparator +
            `"${d.organizations[2] ? d.organizations[2].id : ''}"` +
            this.csvSeparator +
            `"${d.organizations[2] ? d.organizations[2].name : ''}"` +
            this.csvSeparator +
            `"${d.orgCount > 3 ? 'Yes' : 'No'}"` +
            '\r\n'
        })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

  private recoverPagination(): void {
    const rawPagination = window.localStorage.getItem(
      STORAGE_PATIENTS_PAGINATION
    )
    if (rawPagination) {
      const pagination = JSON.parse(rawPagination)

      if (pagination.organization === this.context.organizationId) {
        this.paginator.pageIndex = pagination.page
        this.dietersSource.pageIndex = pagination.page
        this.cdr.detectChanges()
        this.refresh$.next()
      } else {
        window.localStorage.removeItem(STORAGE_PATIENTS_PAGINATION)
      }
    }
  }
}
