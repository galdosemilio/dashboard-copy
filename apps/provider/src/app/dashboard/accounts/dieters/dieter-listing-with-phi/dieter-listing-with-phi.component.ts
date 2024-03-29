import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import {
  ContextService,
  DietersService,
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
import Papa from 'papaparse'
import { debounceTime, delay, filter, take } from 'rxjs/operators'
import { AccountCreateDialog } from '../../dialogs'
import { DieterListingDatabase, DieterListingDataSource } from '../services'
import { CcrPageSizeSelectorComponent } from '@app/shared/components/page-size-selector'
import {
  convertToReadableFormat,
  DataPointTypes,
  NamedEntity,
  PackageData
} from '@coachcare/sdk'
import { PackageFilter } from '@app/shared/components/package-filter'
import { TranslateService } from '@ngx-translate/core'
import { get } from 'lodash'
import { CSV } from '@coachcare/common/shared'

export interface PatientsFilters {
  page?: number
  pageSize?: number
  expires?: Date
  organization?: string
  packages?: PackageFilter
}

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
  packageFilter?: PackageFilter
  refresh$: Subject<void> = new Subject<void>()
  source: DieterListingDataSource
  totalCount: number
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360019923251-Adding-a-Patient'
  isPatientCreationEnabled = true
  initialPackages: PackageData[] = []
  showCurrentBmiColumns = false

  private extraColumns: NamedEntity[] = []

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: DieterListingDatabase,
    private translate: TranslateService,
    private dieters: DietersService
  ) {}

  ngAfterViewInit(): void {
    this.recoverFilters()
    this.pageSizeSelectorComp.onPageSizeChange
      .pipe(untilDestroyed(this))
      .subscribe((pageSize) => {
        this.dieters.storeFilters({
          pageSize,
          organization: this.context.organizationId
        })
      })
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
        ...(this.showCurrentBmiColumns ? [DataPointTypes.BMI] : []),
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
      this.showCurrentBmiColumns =
        resolveConfig(
          'PATIENT_LISTING.SHOW_CURRENT_BMI',
          this.context.organization
        ) ?? []
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
      this.dieters.storeFilters({
        page: page.pageIndex,
        organization: this.context.organizationId
      })
    })
  }

  onPackageFilter(filter): void {
    this.packageFilter = filter
    this.dieters.storeFilters({
      packages: this.packageFilter,
      organization: this.context.organizationId
    })
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

      const temporalSource = new DieterListingDataSource(
        this.database,
        undefined,
        false
      )

      temporalSource.addDefault(criteria)

      const res = (
        await temporalSource.connect().pipe(take(1)).toPromise()
      ).filter((entry) => entry.level === 0 && !entry.isHidden)

      if (!res.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }

      const orgName = this.context.organization.name.replace(/\s/g, '_')
      const filename = `${orgName}_Patient_List.csv`
      let csv = 'PATIENT LIST\r\n'

      const data = res.map((d: DieterListingItem) => {
        const extraRows = this.extraColumns.map((entry) => ({
          [get(translations, entry.name) ?? entry.name]: d.dataPoints?.[
            entry.id
          ]?.value
            ? `"${convertToReadableFormat(
                d.dataPoints[entry.id].value,
                d.dataPoints[entry.id].type,
                rawPreference
              )} ${d.dataPoints[entry.id].type.unit}"`
            : ''
        }))

        const bmiRows = {}

        if (this.showCurrentBmiColumns) {
          bmiRows['Current BMI Date'] = d.dataPoints[DataPointTypes.BMI]
            ? moment(d.dataPoints[DataPointTypes.BMI].recordedAt.local).format(
                'YYYY-MM-DD'
              )
            : ''
          bmiRows['Current BMI'] = d.dataPoints[DataPointTypes.BMI]
            ? convertToReadableFormat(
                d.dataPoints[DataPointTypes.BMI].value,
                d.dataPoints[DataPointTypes.BMI].type,
                rawPreference
              ).toFixed()
            : ''
        }

        const organizationRows = {}
        const phaseRows = {}

        for (let i = 0; i < 3; i += 1) {
          organizationRows[`Organization ID (${i + 1})`] = d.organizations[i]
            ? d.organizations[i].id
            : ''
          organizationRows[`Organization Name (${i + 1})`] = d.organizations[i]
            ? d.organizations[i].name
            : ''
          phaseRows[`Phase ID (${i + 1})`] = d.packages[i]
            ? d.packages[i].id
            : ''
          phaseRows[`Phase Name (${i + 1})`] = d.packages[i]
            ? d.packages[i].name
            : ''
        }

        const row = {
          ID: d.id,
          'First Name': d.firstName,
          'Last Name': d.lastName,
          'Phone Number': d.phone,
          Birthday: d.dateOfBirth
            ? moment(d.dateOfBirth).format('YYYY-MM-DD')
            : '',
          Email: d.email,
          ...extraRows,
          'Blood Pressure':
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
              : '',
          'Current Blood Pressure Date': d.dataPoints?.[
            DataPointTypes.BLOOD_PRESSURE_DIASTOLIC
          ]?.recordedAt
            ? moment
                .utc(
                  d.dataPoints?.[DataPointTypes.BLOOD_PRESSURE_DIASTOLIC]
                    ?.recordedAt.utc
                )
                .format('YYYY-MM-DD')
            : '',
          'Start Weight': d.weight?.start
            ? unitConversion(
                rawPreference,
                'composition',
                d.weight.start.value,
                1
              ) +
              ' ' +
              weightUnit
            : '',
          'Current Weight': d.weight?.end
            ? unitConversion(
                rawPreference,
                'composition',
                d.weight.end.value,
                1
              ) +
              ' ' +
              weightUnit
            : '',
          'Weight Change': d.weight?.change
            ? unitConversion(
                rawPreference,
                'composition',
                d.weight.change.value,
                1
              ) +
              ' ' +
              weightUnit
            : '',
          'Weight Change %': d.weight?.change
            ? d.weight.change.percent + ' ' + '%'
            : '',
          'Start Date': d.startedAt,
          'Start Weight Date': d.weight?.start
            ? moment(d.weight.start.date).format('YYYY-MM-DD')
            : '',
          'Current Weight Date': d.weight?.end
            ? moment(d.weight.end.date).format('YYYY-MM-DD')
            : '',
          ...bmiRows,
          ...organizationRows,
          'More Organization Associations?': d.orgCount > 3 ? 'Yes' : 'No',
          ...phaseRows,
          'More Phase Enrollments?': d.packageCount > 3 ? 'Yes' : 'No'
        }

        return row
      })

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      this.notifier.error(error)
    }
  }

  private recoverFilters(): void {
    const filters = this.dieters.recoverFilters()

    if (!filters) {
      return
    }

    const pageSize = Number(filters.pageSize || 10)
    const page = Number(filters.page || 0)
    this.pageSizeSelectorComp.pageSize = pageSize
    this.paginator.pageIndex = page
    this.source.pageIndex = page
    this.source.pageSize = pageSize
    this.packageFilter = filters.packages
    this.initialPackages = filters.packages?.pkg ?? []
    this.cdr.detectChanges()
    this.refresh$.next()
  }
}
