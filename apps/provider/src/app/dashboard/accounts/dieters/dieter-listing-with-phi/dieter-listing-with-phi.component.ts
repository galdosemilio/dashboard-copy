import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog, MatSort } from '@coachcare/material'
import {
  STORAGE_PAGE_SIZE_PATIENT_LISTING,
  STORAGE_PATIENTS_PAGINATION
} from '@app/config'
import { resolveConfig } from '@app/config/section'
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import {
  _,
  PackageFilterComponent,
  unitConversion,
  DieterListingItem
} from '@app/shared'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, delay, filter, take } from 'rxjs/operators'
import { AccountCreateDialog } from '../../dialogs'
import { DieterListingDatabase, DieterListingDataSource } from '../services'
import { CcrPageSizeSelectorComponent } from '@app/shared/components/page-size-selector'
import {
  convertToReadableFormat,
  DataPointTypes,
  NamedEntity
} from '@coachcare/sdk'
import { PackageFilter } from '@app/shared/components/package-filter'
import { TranslateService } from '@ngx-translate/core'
import { get } from 'lodash'

@UntilDestroy()
@Component({
  selector: 'dieter-listing-with-phi',
  templateUrl: './dieter-listing-with-phi.component.html',
  styleUrls: ['./dieter-listing-with-phi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterListingWithPhiComponent implements AfterViewInit, OnInit {
  @ViewChild(PackageFilterComponent, { static: true })
  packageFilterComp: PackageFilterComponent

  @ViewChild(CcrPageSizeSelectorComponent, { static: true })
  pageSizeSelectorComp: CcrPageSizeSelectorComponent

  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  clinic: SelectedOrganization
  csvSeparator = ','
  packageFilter?: PackageFilter
  refresh$: Subject<void> = new Subject<void>()
  sort: MatSort = new MatSort()
  source: DieterListingDataSource
  totalCount: number
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360019923251-Adding-a-Patient'
  defaultPageSizeStorageKey = STORAGE_PAGE_SIZE_PATIENT_LISTING
  isPatientCreationEnabled = true

  private extraColumns: NamedEntity[] = []

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: DieterListingDatabase,
    private translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    this.recoverPagination()
  }

  ngOnInit(): void {
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

    this.source = new DieterListingDataSource(this.database, this.paginator)
    this.source.addRequired(
      this.context.organization$.pipe(delay(100)),
      () => ({
        organization: this.context.organizationId
      })
    )
    this.source.addDefault({
      type: [
        DataPointTypes.BLOOD_PRESSURE_SYSTOLIC,
        DataPointTypes.BLOOD_PRESSURE_DIASTOLIC
      ]
    })

    this.source.errorHandler = errorHandler
    this.source.addOptional(this.refresh$.pipe(debounceTime(300)), () => ({
      ...this.packageFilter,
      pkg: this.packageFilter?.pkg.map((entry) => entry.id),
      type: [
        DataPointTypes.BLOOD_PRESSURE_SYSTOLIC,
        DataPointTypes.BLOOD_PRESSURE_DIASTOLIC,
        ...this.extraColumns.map((entry) => entry.id)
      ]
    }))
    this.source.change$.pipe(untilDestroyed(this)).subscribe(() => {
      this.totalCount = this.source.totalCount || 0
      this.cdr.detectChanges()
      if (
        this.source.result &&
        !this.source.result.length &&
        this.paginator.pageIndex
      ) {
        this.paginator.firstPage()
      }
    })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org
      this.extraColumns =
        resolveConfig(
          'PATIENT_LISTING.ADDITIONAL_LISTING_COLUMNS',
          this.context.organization
        ) ?? []
      this.source.resetPaginator()
      this.isPatientCreationEnabled =
        this.clinic?.permissions.admin &&
        resolveConfig('PATIENT_LISTING.SHOW_PATIENT_CREATE_BUTTON', org)
    })

    this.pageSizeSelectorComp.onPageSizeChange
      .pipe(untilDestroyed(this))
      .subscribe((pageSize) => {
        this.paginator.pageSize = pageSize ?? this.paginator.pageSize

        if (this.paginator.pageIndex === 0) {
          this.refresh$.next()
          return
        }

        this.paginator.firstPage()
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

  onPackageFilter(filter): void {
    this.packageFilter = filter
    this.refresh$.next()
  }

  onSorted(): void {
    this.packageFilterComp.resetFilters(false)
  }

  createDialog(): void {
    if (!this.clinic.permissions.admin) {
      this.notifier.error(_('NOTIFY.ERROR.CANNOT_CREATE_ACCOUNTS'))
      return
    }

    const dialog = resolveConfig(
      'PATIENT_LISTING.PAYMENT_DISCLAIMER',
      this.context.organization
    )

    if (dialog && dialog.component) {
      this.dialog
        .open(dialog.component, {
          disableClose: true,
          width: '80vw',
          panelClass: 'ccr-full-dialog'
        })
        .afterClosed()
        .pipe(filter((agree) => agree))
        .subscribe(() => this.onOpenAccountCreateDialog())
    } else {
      this.onOpenAccountCreateDialog()
    }
  }

  onOpenAccountCreateDialog() {
    this.dialog
      .open(AccountCreateDialog, {
        disableClose: true,
        data: {
          accountType: 'dieter'
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((user) => user))
      .subscribe(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_CREATED'))
        this.source.refresh()
      })
  }

  async downloadCSV() {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      const maxPerCSV = 5000
      const csvAmount = Math.ceil(this.totalCount / maxPerCSV)

      if (csvAmount > 1) {
        this.notifier.info(_('NOTIFY.INFO.MULTIPLE_CSV_FILES'))
      }

      for (let i = 0; i < csvAmount; ++i) {
        await this.generateSingleCSV(maxPerCSV, maxPerCSV * i)
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  private async generateSingleCSV(
    limit: number,
    offset: number
  ): Promise<void> {
    try {
      const criteria = {
        ...this.source.args,
        limit: limit,
        offset: offset,
        organization: this.context.organizationId
      }

      const translations =
        this.translate.translations[this.translate.currentLang]

      const rawPreference = this.context.user.measurementPreference
      const weightUnit = rawPreference === 'metric' ? 'kg' : 'lbs'

      const temporalSource = new DieterListingDataSource(this.database)

      temporalSource.addDefault(criteria)

      const res = (
        await temporalSource.connect().pipe(take(1)).toPromise()
      ).filter((entry) => entry.level === 0)

      if (!res.length) {
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
        'Phone Number' +
        this.csvSeparator +
        'Email' +
        this.csvSeparator +
        this.extraColumns
          .map((entry) => get(translations, entry.name) ?? entry.name)
          .join(this.csvSeparator) +
        (this.extraColumns.length ? this.csvSeparator : '') +
        'Blood Pressure' +
        this.csvSeparator +
        'Start Weight' +
        this.csvSeparator +
        'Current Weight' +
        this.csvSeparator +
        'Weight Change' +
        this.csvSeparator +
        'Weight Change %' +
        this.csvSeparator +
        'Start Date' +
        this.csvSeparator +
        'Start Weight Date' +
        this.csvSeparator +
        'Current Weight Date' +
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
        this.csvSeparator +
        'Phase ID (1)' +
        this.csvSeparator +
        'Phase Name (1)' +
        this.csvSeparator +
        'Phase ID (2)' +
        this.csvSeparator +
        'Phase Name (2)' +
        this.csvSeparator +
        'Phase ID (3)' +
        this.csvSeparator +
        'Phase Name (3)' +
        this.csvSeparator +
        'More Phase Enrollments?' +
        '\r\n'

      res.forEach((d: DieterListingItem) => {
        csv +=
          `"${d.id}"` +
          this.csvSeparator +
          `"${d.firstName}"` +
          this.csvSeparator +
          `"${d.lastName}"` +
          this.csvSeparator +
          `"${d.phone}"` +
          this.csvSeparator +
          `"${d.email}"` +
          this.csvSeparator +
          this.extraColumns
            .map((entry) =>
              d.dataPoints?.[entry.id].value
                ? `"${convertToReadableFormat(
                    d.dataPoints[entry.id].value,
                    d.dataPoints[entry.id].type,
                    rawPreference
                  )} ${d.dataPoints[entry.id].type.unit}"`
                : ''
            )
            .join(this.csvSeparator) +
          (this.extraColumns.length ? this.csvSeparator : '') +
          `"${
            d.dataPoints?.[DataPointTypes.BLOOD_PRESSURE_SYSTOLIC] &&
            d.dataPoints?.[DataPointTypes.BLOOD_PRESSURE_DIASTOLIC]
              ? `${convertToReadableFormat(
                  d.dataPoints[DataPointTypes.BLOOD_PRESSURE_SYSTOLIC].value,
                  d.dataPoints[DataPointTypes.BLOOD_PRESSURE_SYSTOLIC].type,
                  rawPreference
                )} / ${convertToReadableFormat(
                  d.dataPoints[DataPointTypes.BLOOD_PRESSURE_DIASTOLIC].value,
                  d.dataPoints[DataPointTypes.BLOOD_PRESSURE_DIASTOLIC].type,
                  rawPreference
                )} ${
                  d.dataPoints[DataPointTypes.BLOOD_PRESSURE_DIASTOLIC].type
                    .unit
                }`
              : ''
          }"` +
          this.csvSeparator +
          `"${
            d.weight
              ? unitConversion(
                  rawPreference,
                  'composition',
                  d.weight.start.value,
                  1
                ) +
                ' ' +
                weightUnit
              : ''
          }"` +
          this.csvSeparator +
          `"${
            d.weight
              ? unitConversion(
                  rawPreference,
                  'composition',
                  d.weight.end.value,
                  1
                ) +
                ' ' +
                weightUnit
              : ''
          }"` +
          this.csvSeparator +
          `"${
            d.weight && d.weight.change
              ? unitConversion(
                  rawPreference,
                  'composition',
                  d.weight.change.value,
                  1
                ) +
                ' ' +
                weightUnit
              : ''
          }"` +
          this.csvSeparator +
          `"${
            d.weight && d.weight.change
              ? d.weight.change.percent + ' ' + '%'
              : ''
          }"` +
          this.csvSeparator +
          `"${moment(d.startedAt).format('YYYY-MM-DD')}"` +
          this.csvSeparator +
          `"${
            d.weight ? moment(d.weight.start.date).format('YYYY-MM-DD') : ''
          }"` +
          this.csvSeparator +
          `"${
            d.weight ? moment(d.weight.end.date).format('YYYY-MM-DD') : ''
          }"` +
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
          this.csvSeparator +
          `"${d.packages[0] ? d.packages[0].id : ''}"` +
          this.csvSeparator +
          `"${d.packages[0] ? d.packages[0].name : ''}"` +
          this.csvSeparator +
          `"${d.packages[1] ? d.packages[1].id : ''}"` +
          this.csvSeparator +
          `"${d.packages[1] ? d.packages[1].name : ''}"` +
          this.csvSeparator +
          `"${d.packages[2] ? d.packages[2].id : ''}"` +
          this.csvSeparator +
          `"${d.packages[2] ? d.packages[2].name : ''}"` +
          this.csvSeparator +
          `"${d.packageCount > 3 ? 'Yes' : 'No'}"` +
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

  private recoverPagination(): void {
    const rawPagination = window.localStorage.getItem(
      STORAGE_PATIENTS_PAGINATION
    )
    if (rawPagination) {
      const pagination = JSON.parse(rawPagination)

      if (pagination.organization === this.context.organizationId) {
        this.paginator.pageIndex = pagination.page
        this.source.pageIndex = pagination.page
        this.cdr.detectChanges()
        this.refresh$.next()
      } else {
        window.localStorage.removeItem(STORAGE_PATIENTS_PAGINATION)
      }
    }
  }
}
