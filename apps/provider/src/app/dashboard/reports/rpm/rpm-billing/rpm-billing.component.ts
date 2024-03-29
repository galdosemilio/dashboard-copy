import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog } from '@coachcare/material'
import { ClosePanel, OpenPanel } from '@app/layout/store'
import {
  CareManagementService,
  ContextService,
  NotifierService
} from '@app/service'
import {
  OrganizationEntity,
  PackageOrganization,
  Timezone,
  TimezoneResponse,
  ExternalIdentifier,
  FetchCareManagementBillingSnapshotRequest,
  CareManagementServiceType,
  CareManagementState
} from '@coachcare/sdk'
import { SelectOption, _ } from '@app/shared/utils'
import { select, Store } from '@ngrx/store'
import { chain, times, isEmpty, countBy, startCase, groupBy } from 'lodash'
import * as moment from 'moment'
import Papa from 'papaparse'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { firstValueFrom, Subject } from 'rxjs'
import { debounceTime, filter, map } from 'rxjs/operators'
import {
  ReportsCriteria,
  ReportsDatabase,
  RPMBillingDataSource
} from '../../services'
import { criteriaSelector, ReportsState } from '../../store'
import { RPMStateSummaryBilling, RPMStateSummaryEntry } from '../models'
import {
  STORAGE_PAGE_SIZE_RPM_BILLING,
  STORAGE_PRM_BILLING_FILTER,
  STORAGE_RPM_BILLING_COLUMN_INDEX,
  STORAGE_RPM_BILLING_PAGINATION,
  STORAGE_RPM_BILLING_SORT
} from '@app/config'
import { CcrPageSizeSelectorComponent } from '@app/shared/components/page-size-selector'
import { PromptDialog } from '@app/shared/dialogs'
import { environment } from 'apps/provider/src/environments/environment'
import { CcrTableSortDirective, RPMStatusDialog } from '@app/shared'
import { DeviceDetectorService } from 'ngx-device-detector'
import { CSV } from '@coachcare/common/shared'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { RPMMonthlySummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchRPMMonthlyBillingSummaryResponse.interface'
import { CareManagementStateSummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'
import { CareManagementBillingMonthItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingMonthResponse.interface'
import { CareManagementPermissionsService } from '@app/service/care-management-permissions.service'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { MonitoringReportDialog } from '../../dialogs/monitoring-report-dialog'

interface StorageFilter {
  selectedClinicId?: string
  package?: number
  query?: string
  status?: string
  supervisingProvider?: SelectOption<number>
}

@UntilDestroy()
@Component({
  selector: 'app-reports-rpm-billing',
  templateUrl: './rpm-billing.component.html',
  styleUrls: ['./rpm-billing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RPMBillingComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @ViewChild(CcrTableSortDirective, { static: true })
  sort: CcrTableSortDirective

  @ViewChild(CcrPageSizeSelectorComponent, { static: true })
  pageSizeSelectorComp: CcrPageSizeSelectorComponent

  @ViewChild('container') tableContainer: ElementRef

  @ViewChildren('columns') tableColumns: QueryList<ElementRef>

  public supervisingProviderControl = new FormControl()

  public columns: string[] = [
    'index',
    'firstName',
    'lastName',
    'dob',
    'deviceSupplied',
    'status',
    'activationDate',
    'codes'
  ]
  public criteria: Partial<FetchCareManagementBillingSnapshotRequest> = {
    asOf: moment().format('YYYY-MM-DD')
  }
  public defaultPageSizeStorageKey = STORAGE_PAGE_SIZE_RPM_BILLING
  public isDesktop: boolean
  public isLoading: boolean
  public isTopLevelAccount = false
  public rows: CareManagementStateSummaryItem[] = []
  public searchForm: FormGroup
  public selectedClinic?: OrganizationEntity
  public source: RPMBillingDataSource
  public totalCount: number = 0
  public packages: SelectOption<number>[] = []
  public selectedStatus: string
  public timezoneName: string
  private storageFilter: StorageFilter
  public supervisingProviders: SelectOption<number>[] = []
  public selectedSupervisingProvider: SelectOption<number>
  public selectedServiceTypeId: string
  public selectedServiceType: CareManagementServiceType

  private timezones: Array<TimezoneResponse> = this.timezone.fetch()
  private refresh$: Subject<void> = new Subject<void>()
  private selectedClinic$ = new Subject<OrganizationEntity | null>()
  private selectedSupervisingProvider$ =
    new Subject<SelectOption<number> | null>()
  private monitoringReportLimit = 1000

  get cptCodes() {
    return this.getCptCodes(this.selectedServiceTypeId)
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private store: Store<ReportsState>,
    private packageOrganization: PackageOrganization,
    private timezone: Timezone,
    private translator: TranslateService,
    private careManagementState: CareManagementState,
    private careManagementService: CareManagementService,
    private careManagementPermissions: CareManagementPermissionsService
  ) {
    this.sortHandler = this.sortHandler.bind(this)
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
    this.source.unsetSorter()
  }

  public ngAfterViewInit(): void {
    this.recoverPagination()
    this.applyStorageSort()
    this.cdr.detectChanges()
    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((values) => {
        this.rows = values
        this.scrollToColumnIndex()
      })
  }

  public ngOnInit(): void {
    this.isDesktop = this.deviceDetector.isDesktop()
    const storageFilterString = localStorage.getItem(STORAGE_PRM_BILLING_FILTER)

    if (storageFilterString) {
      this.storageFilter = JSON.parse(storageFilterString)
      this.selectedStatus = this.storageFilter?.status
      this.selectedSupervisingProvider = this.storageFilter?.supervisingProvider
      this.supervisingProviderControl.setValue(
        this.selectedSupervisingProvider?.viewValue
      )
    }

    // get the current lang
    const lang = this.translator.currentLang.split('-')[0]
    this.timezoneName = this.timezones.find(
      (entry) => entry.code === this.context.user.timezone
    )?.lang[lang]

    this.translator.onLangChange.subscribe((event: LangChangeEvent) => {
      const lang = event.lang.split('-')[0]
      this.timezoneName = this.timezones.find(
        (entry) => entry.code === this.context.user.timezone
      )?.lang[lang]
    })
    this.store.dispatch(new ClosePanel())
    this.createStatusFilterForm()

    this.sort.sortChange.pipe(untilDestroyed(this)).subscribe(() => {
      if (!this.sort.direction) {
        window.localStorage.removeItem(STORAGE_RPM_BILLING_SORT)
      } else {
        window.localStorage.setItem(
          STORAGE_RPM_BILLING_SORT,
          JSON.stringify({
            active: this.sort.active,
            direction: this.sort.direction
          })
        )
      }
    })

    this.createDataSource()

    this.selectedClinic$.pipe(untilDestroyed(this)).subscribe((clinic) => {
      this.selectedClinic = clinic
      this.searchForm.patchValue({
        package: null
      })
      this.selectedSupervisingProvider$.next(null)
      void this.resolvePackages(clinic)
      this.refresh()
    })

    this.selectedSupervisingProvider$
      .pipe(untilDestroyed(this))
      .subscribe((supervisingProvider) => {
        this.selectedSupervisingProvider = supervisingProvider

        if (!supervisingProvider) {
          this.supervisingProviderControl.setValue('')
        }

        window.localStorage.setItem(
          STORAGE_PRM_BILLING_FILTER,
          JSON.stringify({
            ...this.searchForm.value,
            selectedClinicId: this.selectedClinic?.id,
            supervisingProvider
          })
        )
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      const selectedClinic =
        this.storageFilter &&
        this.context.organizations.find(
          (entry) => entry.id === this.storageFilter.selectedClinicId
        )

      if (selectedClinic) {
        this.selectedClinic = selectedClinic
        void this.resolvePackages(selectedClinic)
      } else if (org.id === environment.coachcareOrgId) {
        // coachcare only
        this.selectedClinic$.next(org)
        this.isTopLevelAccount = true
      } else {
        this.isTopLevelAccount = false
      }
    })
  }

  private getCptCodes(serviceTypeId: string) {
    return chain(this.careManagementService.billingCodes)
      .filter((entry) => entry.serviceType.id === serviceTypeId)
      .flatMap((entry) => {
        const iterations = entry.requirements?.maxIterations ?? 1
        return new Array(iterations)
          .fill(entry.value)
          .map((code, index) =>
            iterations > 1 ? `${code} (${index + 1})` : code
          )
      })
      .valueOf()
  }

  public clearSearchQuery(): void {
    this.searchForm.patchValue({
      query: ''
    })
  }

  public async download(
    reportType: 'superbill' | 'monitoring' | 'billing'
  ): Promise<void> {
    const criteria = this.source.args
    // If the user does not proceed with the download after the not-last-day-of-month warning, stop
    // Continue if they accept the warning or the billing report is selected (specific day does not matter)
    if (
      reportType !== 'billing' &&
      !(await this.presentDaySelectionWarning(criteria.asOf))
    ) {
      return
    }

    switch (reportType) {
      case 'superbill':
        return this.downloadSuperbillReport()
      case 'billing':
        return this.downloadBillingReport()
    }
  }

  public async onOpenMonitoringReportDialog() {
    this.dialog
      .open(MonitoringReportDialog, {
        disableClose: true
      })
      .afterClosed()
      .pipe(filter((serviceType) => serviceType))
      .subscribe((serviceType) => this.onDownloadMonitoringReport(serviceType))
  }

  public onServiceTypeChange(event: string): void {
    this.selectedServiceTypeId = event
    this.selectedServiceType =
      this.context.user.careManagementServiceTypes.find(
        (entry) => entry.id === event
      )
    this.refresh()
  }

  // If the selected day if not today OR the last day of a month, present warning that report may be incomplete
  // Return true if warning not needed OR if user selected to continue
  // Return false if user was presented warning and chose to not continue
  private async presentDaySelectionWarning(asOf: string): Promise<boolean> {
    const now = moment()
    const currentAsOf = moment(asOf).isSameOrAfter(now, 'day')
      ? now
      : moment(asOf).endOf('day')

    if (
      currentAsOf.isSame(now, 'day') ||
      currentAsOf.isSame(currentAsOf.clone().endOf('month'), 'day')
    ) {
      return true
    }

    return firstValueFrom(
      this.dialog
        .open(PromptDialog, {
          data: {
            title: _('REPORTS.RPM_BILLING_DOWNLOAD_CONFIRM'),
            content: _('REPORTS.RPM_BILLING_DOWNLOAD_CONFIRM_ABOUT'),
            yes: _('BOARD.DOWNLOAD_REPORT'),
            no: _('GLOBAL.CANCEL')
          }
        })
        .afterClosed()
        .pipe(map((res) => res === true))
    )
  }

  private getExternalIdentifierNames(
    data: Array<
      | RPMStateSummaryEntry
      | RPMMonthlySummaryItem
      | CareManagementBillingMonthItem
    >
  ): string[] {
    return chain(data)
      .map((entry) =>
        chain(entry.externalIdentifiers || [])
          .groupBy((entry) => entry.name)
          .valueOf()
      )
      .reduce((obj, entry) => {
        for (const [key, value] of Object.entries(entry)) {
          if (!obj[key] || obj[key] < value.length) {
            obj[key] = value.length
          }
        }
        return obj
      }, {})
      .flatMap((count, key) => times(count, () => key))
      .valueOf()
  }

  private addExternalIdentifierHeaders(
    externalIdentifierNames: string[],
    headers: string[],
    firstRows: string[],
    secondRows?: string[]
  ) {
    externalIdentifierNames.forEach((entry, index) => {
      if (secondRows) {
        firstRows.push('')
        firstRows.push('')
        firstRows.push('')

        secondRows.push('')
        secondRows.push('Identifier')
        secondRows.push('')
      } else {
        firstRows.push('')
        firstRows.push('Identifier')
        firstRows.push('')
      }

      headers.push('ID')
      headers.push('Name')
      headers.push('Value')
    })

    return {
      firstRows,
      secondRows,
      headers
    }
  }

  private addExternalIdentifierValues(
    externalIdentifierNames: string[],
    externalIdentifiers: ExternalIdentifier[],
    row: string[]
  ) {
    if (externalIdentifierNames.length === 0) {
      return ''
    }

    const externalIdentifierNameGroup = countBy(externalIdentifierNames)
    const entries = Object.entries(externalIdentifierNameGroup)
    entries.forEach(([name, count], eIndex) => {
      const filteredExternalIdentifiers =
        externalIdentifiers?.filter((item) => item.name === name) || []

      times(count, (index) => {
        const externalIdentifier = filteredExternalIdentifiers[index]

        if (externalIdentifier) {
          row.push(externalIdentifier.id)
          row.push(externalIdentifier.name)
          row.push(externalIdentifier.value)
        } else {
          row.push('')
          row.push('')
          row.push('')
        }
      })
    })
  }

  private getMonitoringReportHeaders(
    serviceTypes: CareManagementServiceType[],
    entries: RPMStateSummaryEntry[]
  ) {
    const currentAsOf = moment(this.criteria.asOf).isSameOrAfter(
      moment(),
      'day'
    )
      ? moment()
      : moment(this.criteria.asOf).endOf('day')

    const headers = ['ID', 'First Name', 'Last Name', 'Date of Birth']
    const firstRow = [`As of: ${currentAsOf.format('MMM D, YYYY')}`, '', '', '']
    const footerRow = [
      `${currentAsOf.format('dddd, MMM D, YYYY HH:mm:ss A [GMT]Z')}`
    ]
    let secondRow = null

    if (this.timezoneName) {
      secondRow = [
        `GENERATED IN ${this.timezoneName.toUpperCase()}`,
        '',
        '',
        ''
      ]
    }

    const dynamicHeaders = [
      'Primary Diagnosis',
      'Secondary Diagnosis',
      'Supervising Provider',
      'Organization ID',
      'Organization Name',
      'Status',
      'Activation Date',
      'Billing Type',
      'Monitoring Type'
    ]

    for (const serviceType of serviceTypes) {
      if (
        this.careManagementService.serviceTypeMap[serviceType.id]?.deviceSetup
      ) {
        headers.push(
          serviceTypes.length > 1
            ? `${serviceType.name} Device Type`
            : 'Device Type'
        )
        firstRow.push('')

        if (secondRow) {
          secondRow.push('')
        }
      }

      for (const header of dynamicHeaders) {
        headers.push(
          serviceTypes.length > 1 ? `${serviceType.name} ${header}` : header
        )
        firstRow.push('')

        if (secondRow) {
          secondRow.push('')
        }
      }

      const cptCodes = this.getCptCodes(serviceType.id)

      for (const billingCode of cptCodes) {
        firstRow.push(billingCode)
        secondRow?.push('')
        headers.push('Latest Claim Date')

        if (serviceTypes.length === 1) {
          firstRow.push(billingCode)
          secondRow?.push('')
          headers.push('Next Claim Requirements')
        }
      }
    }
    if (serviceTypes.length === 1) {
      const externalIdentifierNames = this.getExternalIdentifierNames(entries)

      this.addExternalIdentifierHeaders(
        externalIdentifierNames,
        headers,
        firstRow,
        secondRow
      )
    }

    return {
      headers,
      firstRow,
      secondRow,
      footerRow
    }
  }

  private async downloadMonitoringReport(
    serviceTypeId: string | 'all',
    page: number
  ) {
    const criteria = this.source.args
    const rawResponse = await this.database.fetchCareManagementBillingSnapshot({
      ...criteria,
      serviceType: serviceTypeId === 'all' ? undefined : serviceTypeId,
      limit: this.monitoringReportLimit,
      offset: (page - 1) * this.monitoringReportLimit
    })

    const serviceTypes =
      serviceTypeId === 'all'
        ? this.careManagementService.serviceTypes
        : this.careManagementService.serviceTypes.filter(
            (entry) => entry.id === serviceTypeId
          )
    const availableServiceTypeIds = serviceTypes.map(
      (serviceType) => serviceType.id
    )
    const res: RPMStateSummaryEntry[] = rawResponse.data
      .filter((entry) =>
        availableServiceTypeIds.includes(entry.state.serviceType.id)
      )
      .map((entry) => {
        const allBillings = this.careManagementService.billingCodes
          .filter((code) => code.serviceType.id === entry.state.serviceType.id)
          .map(
            (key) =>
              ({
                code: key.value,
                eligibility: {}
              } as any)
          )

        return new RPMStateSummaryEntry(
          entry,
          allBillings,
          this.careManagementService.trackableCptCodes[
            entry.state.serviceType.id
          ],
          this.criteria.asOf
        )
      })

    if (!res.length) {
      this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      return true
    }

    const selectedServiceType =
      this.careManagementService.serviceTypeMap[serviceTypeId]?.serviceType

    const filename = `${
      selectedServiceType ? selectedServiceType.name : 'Monitoring_Report'
    }_${moment(criteria.asOf).format('MMM_YYYY')}_${page}`

    const isMultipleServiceType = serviceTypes.length > 1
    const externalIdentifierNames = this.getExternalIdentifierNames(res)
    const { firstRow, secondRow, headers, footerRow } =
      this.getMonitoringReportHeaders(serviceTypes, res)
    const data = groupBy(res, (entry) => entry.account.id)

    const dataRows = Object.entries(data).map(([id, entries]) => {
      const firstEntry = entries[0]
      const row = [
        firstEntry.id,
        firstEntry.account.firstName,
        firstEntry.account.lastName,
        moment(firstEntry.account.dateOfBirth).format('MM/DD/YYYY')
      ]

      for (const serviceType of serviceTypes) {
        const entry = entries.find(
          (item) => item.state.serviceType.id === serviceType.id
        )
        const cptCodes = this.getCptCodes(serviceType.id)

        if (
          this.careManagementService.serviceTypeMap[serviceType.id]?.deviceSetup
        ) {
          row.push(entry?.device?.name || '')
        }

        row.push(
          (entry?.state?.isActive && entry?.state?.diagnosis?.primary) || ''
        )
        row.push(
          (entry?.state?.isActive && entry?.state?.diagnosis?.secondary) || ''
        )
        row.push(
          entry?.state?.isActive && entry?.state?.supervisingProvider
            ? `${entry.state?.supervisingProvider.firstName} ${entry.state?.supervisingProvider.lastName}`
            : ''
        )
        row.push(entry?.organization?.id || '')
        row.push(entry?.organization?.name || '')
        row.push(entry ? (entry.state?.isActive ? 'Active' : 'Inactive') : '')
        row.push(
          entry
            ? entry.state?.isActive
              ? moment(entry.state.startedAt).format('MM/DD/YYYY')
              : 'No'
            : ''
        )
        row.push(entry ? startCase(entry.state?.preference?.billing) : '')
        row.push(entry ? startCase(entry?.state?.preference?.monitoring) : '')

        for (const code of cptCodes) {
          const billingEntry = entry?.billing.find(
            (billing) => billing.code === code
          )

          if (billingEntry) {
            this.getRPMBillingEntryContent(
              billingEntry,
              entry,
              row,
              isMultipleServiceType
            )
          } else {
            row.push(entry ? 'N/A' : '')

            if (!isMultipleServiceType) {
              row.push(entry ? 'N/A' : '')
            }
          }
        }

        if (!isMultipleServiceType && entry) {
          this.addExternalIdentifierValues(
            externalIdentifierNames,
            entry.externalIdentifiers,
            row
          )
        }
      }

      return row
    })

    const csv = Papa.unparse(
      [firstRow, secondRow, headers, ...dataRows, [''], footerRow],
      { header: false }
    )

    CSV.toFile({ content: csv, filename })

    return (
      page * this.monitoringReportLimit >= rawResponse.pagination.totalCount
    )
  }

  private async onDownloadMonitoringReport(
    serviceTypeId: string | 'all'
  ): Promise<void> {
    try {
      this.isLoading = true
      let page = 1

      while (true) {
        const completed = await this.downloadMonitoringReport(
          serviceTypeId,
          page
        )

        page += 1

        if (completed) {
          break
        }
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async downloadSuperbillReport(): Promise<void> {
    try {
      this.isLoading = true

      const asOfDate = this.criteria.asOf
        ? moment(this.criteria.asOf).startOf('month').format('YYYY-MM-DD')
        : moment().startOf('month').format('YYYY-MM-DD')

      const data = await this.source.fetchSuperbill({
        ...this.source.args,
        organization: this.context.organization.id,
        date: asOfDate,
        limit: 'all',
        offset: 0
      })
      const blob = new Blob([data])
      const link = document.createElement('a')
      const rawFileName = `${this.context.organization.name}__${this.selectedServiceType.name}_Superbill`
      link.href = window.URL.createObjectURL(blob)
      link.download = `${rawFileName.replace(/\W/gi, '')}.xlsx`
      link.click()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async downloadBillingReport(): Promise<void> {
    try {
      this.isLoading = true

      if (!this.source.args.organization && !this.isTopLevelAccount) {
        throw new Error(
          _('NOTIFY.ERROR.REQUIRED_ORG_FOR_DOWNLOAD_BILLING_REPORT')
        )
      }

      const asOfDate = this.criteria.asOf
        ? moment(this.criteria.asOf).startOf('month').format('YYYY-MM-DD')
        : moment().startOf('month').format('YYYY-MM-DD')

      const response =
        await this.database.fetchCareManagementMonthlyBillingReport({
          ...this.source.args,
          organization:
            this.source.args.organization ?? environment.coachcareOrgId,
          date: asOfDate,
          limit: 'all',
          offset: 0
        })

      const data = response.data

      if (!data.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }

      const externalIdentifierNames = this.getExternalIdentifierNames(data)

      const filename = `${this.selectedServiceType.name}_BILLING_${moment(
        asOfDate
      ).format('MMM_YYYY')}.csv`

      const currentAsOf = moment(asOfDate)

      const firstRow = [`As of: ${currentAsOf.format('MMM, YYYY')}`]

      let secondRow = null
      if (this.timezoneName) {
        secondRow = [`GENERATED IN ${this.timezoneName.toUpperCase()}`]
      }

      const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Date of Birth',
        'Device Type',
        'Primary Diagnosis',
        'Secondary Diagnosis',
        'Supervising Provider',
        'Organization ID',
        'Organization Name',
        'Status',
        'Activation Date'
      ]

      headers.forEach((value, index) => {
        if (!firstRow[index]) {
          firstRow.push('')
        }

        if (secondRow && !secondRow[index]) {
          secondRow.push('')
        }
      })

      this.cptCodes.forEach((code, index) => {
        firstRow.push(code)
        headers.push('Claim Date')
        if (secondRow) {
          secondRow.push('')
        }
      })

      this.addExternalIdentifierHeaders(
        externalIdentifierNames,
        headers,
        firstRow,
        secondRow
      )

      const dataRows = data.map((entry) => {
        const eligibilityGroup = chain(entry.eligibility)
          .groupBy('code')
          .value()

        const row = [
          entry.account.id,
          entry.account.firstName,
          entry.account.lastName,
          moment.utc(entry.account.dateOfBirth).format('MM/DD/YYYY'),
          entry.state?.billable?.plan?.name || '',
          entry.state?.billable?.diagnosis?.primary || '',
          entry.state?.billable?.diagnosis?.secondary || '',
          entry.state?.billable?.supervisingProvider
            ? `${entry.state.billable.supervisingProvider.firstName} ${entry.state.billable.supervisingProvider.lastName}`
            : '',
          entry.organization?.state?.id || '',
          entry.organization?.state?.name || '',
          entry.state?.current?.isActive ? 'Active' : 'Inactive',
          entry.state?.billable?.isActive
            ? moment(entry.state.billable.startedAt).format('MM/DD/YYYY')
            : 'No'
        ]

        this.cptCodes.forEach((billingCode, index) => {
          if (eligibilityGroup[billingCode]?.length) {
            row.push(
              moment(eligibilityGroup[billingCode][0].eligibleAt).format(
                'MM/DD/YYYY'
              )
            )
          } else {
            row.push('N/A')
          }
        })

        this.addExternalIdentifierValues(
          externalIdentifierNames,
          entry.externalIdentifiers,
          row
        )

        return row
      })

      const csv = Papa.unparse([firstRow, secondRow, headers, ...dataRows], {
        header: false
      })

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  public openPatientInNewTab(patientId: string): void {
    window.open(`./accounts/patients/${patientId}`, '_blank')
  }

  private async resolvePackages(clinic: OrganizationEntity) {
    this.packages = [{ viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined }]

    if (!clinic) {
      return
    }

    try {
      const res = await this.packageOrganization.getAll({
        organization: clinic.id,
        isActive: true,
        limit: 'all'
      })

      this.packages = [
        ...this.packages,
        ...res.data.map((entry) => ({
          viewValue: entry.package.title,
          value: Number(entry.package.id)
        }))
      ]

      const packageValue = this.searchForm.value?.package
      const selectedPackage = this.packages.find(
        (entry) => entry.value === packageValue
      )

      if (packageValue && !selectedPackage) {
        this.searchForm.patchValue({
          package: null
        })
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }

  private async resolveSupervisingProviders() {
    this.supervisingProviders = []

    if (!this.supervisingProviderControl.value) {
      if (this.selectedSupervisingProvider) {
        this.onCleanSupervisingProvider()
      }
      return
    }

    try {
      const res = this.careManagementState.getSupervisingProviders({
        organization: this.selectedClinic?.id || environment.coachcareOrgId,
        query: this.supervisingProviderControl.value || undefined
      })

      this.supervisingProviders = [
        ...this.supervisingProviders,
        ...(await res).data.map((entry) => ({
          viewValue: `${entry.account.firstName} ${entry.account.lastName}`,
          value: +entry.account.id
        }))
      ]
    } catch (err) {
      this.notifier.error(err)
    }
  }

  public onRemoveClinic(): void {
    this.selectedClinic$.next(null)
  }

  public onSelectClinic(clinic: OrganizationEntity): void {
    this.selectedClinic$.next(clinic)
  }

  public onSelectSupervisingProvider(
    supervisingProvider: SelectOption<number>
  ): void {
    this.selectedSupervisingProvider$.next(supervisingProvider)

    this.refresh()
  }

  public onCleanSupervisingProvider(): void {
    this.selectedSupervisingProvider$.next(null)
    this.refresh()
  }

  public onStatusFilterChange($event: Event): void {
    if ($event.type === 'change') {
      this.paginator.firstPage()
      const status = ($event.target as HTMLSelectElement).value
      this.selectedStatus = status
      this.searchForm.patchValue({
        status
      })
    }
  }

  private applyStorageSort(): void {
    try {
      const storageSort = JSON.parse(
        window.localStorage.getItem(STORAGE_RPM_BILLING_SORT)
      )

      if (storageSort) {
        this.sort.sort({
          property: storageSort.active,
          dir: storageSort.direction
        })
      } else {
        this.sort.sort({
          property: 'lastName',
          dir: 'asc'
        })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createDataSource(): void {
    this.source = new RPMBillingDataSource(
      this.database,
      this.notifier,
      this.careManagementService,
      this.paginator
    )
    this.source.addDefault({ status: 'active' })

    this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      const values = this.searchForm.value

      localStorage.setItem(
        STORAGE_PRM_BILLING_FILTER,
        JSON.stringify({
          selectedClinicId: this.selectedClinic?.id,
          ...values
        })
      )
      this.refresh()
    })

    this.supervisingProviderControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => this.resolveSupervisingProviders())

    this.source.addOptional(this.refresh$.pipe(debounceTime(500)), () => {
      const selectedDate = moment(this.criteria.asOf)

      return {
        asOf: selectedDate.isSameOrAfter(moment(), 'day')
          ? undefined
          : selectedDate.endOf('day').toISOString(),

        organization: this.selectedClinic?.id ?? undefined,
        query: this.searchForm.value.query || undefined,
        package: this.searchForm.value.package || undefined,
        status: this.searchForm.value.status || 'all',
        user: this.context.user.id,
        serviceType: this.selectedServiceTypeId,
        supervisingProvider:
          this.selectedSupervisingProvider?.value || undefined
      }
    })

    this.source.setSorter(this.sort, this.sortHandler)

    this.pageSizeSelectorComp.onPageSizeChange
      .pipe(untilDestroyed(this))
      .subscribe((pageSize) => {
        this.paginator.pageSize = pageSize ?? this.paginator.pageSize

        this.refresh()
      })

    this.source.change$
      .pipe(untilDestroyed(this))
      .subscribe(() => (this.totalCount = this.source.totalCount ?? 0))

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (isEmpty(reportsCriteria)) {
          return
        }

        this.criteria.asOf = reportsCriteria.endDate
        this.paginator.firstPage()
        this.refresh$.next()
      })

    this.paginator.page.pipe(untilDestroyed(this)).subscribe((page) => {
      window.localStorage.setItem(
        STORAGE_RPM_BILLING_PAGINATION,
        JSON.stringify({
          page: page.pageIndex,
          organization: this.context.organizationId
        })
      )
    })
  }

  private createStatusFilterForm(): void {
    this.searchForm = this.fb.group({
      query: [this.storageFilter?.query ?? ''],
      package: [this.storageFilter?.package ?? ''],
      status: [this.storageFilter?.status ?? 'active']
    })
  }

  private getRPMBillingEntryContent(
    billingEntry: RPMStateSummaryBilling,
    entry: RPMStateSummaryEntry,
    row: string[],
    isMultipleServiceType = false
  ): string {
    row.push(
      billingEntry.eligibility.last
        ? moment(billingEntry.eligibility.last.timestamp).format('MM/DD/YYYY')
        : 'N/A'
    )

    if (isMultipleServiceType) {
      return
    }

    if (
      !billingEntry.eligibility.next ||
      !entry.state?.isActive ||
      (billingEntry.trackableCode?.maxEligibleAmount >= 2 &&
        billingEntry.hasClaims)
    ) {
      row.push('N/A')

      return
    }

    // Means we have next eligibility requirements that we should display
    let text = ''

    const nextObjectKeys = Object.keys(billingEntry.eligibility.next).filter(
      (key) =>
        key !== 'earliestEligibleAt' &&
        billingEntry.eligibility.next[key]?.remaining
    )

    // Previous code requirements (happens between 99458 and 99457, for example)
    if (billingEntry.hasCodeRequirements) {
      billingEntry.eligibility.next.relatedCodeRequirementsNotMet.forEach(
        (code, index, array) => {
          text += `${code} requirements not satisfied`

          if (index + 1 < array.length) {
            text += '; '
          }
        }
      )

      if (billingEntry.remainingDays || nextObjectKeys.length) {
        text += '; '
      }
    }

    // Remaining days
    if (billingEntry.remainingDays) {
      text += `${billingEntry.remainingDays} more calendar days`
    }

    // The only notable condition here is 99458, that one means
    // that if there is an alreadyEligibleCount [meaning that the MONITORING TIME has
    // been completed, not that the iteration is ACTUALLY eligibile.
    // Don't be fooled by the name of the property like me!], then the requirements
    // that appear as part of this object are not for 99458 x1 but for 99458 x2
    // and that we should skip them.
    if (
      billingEntry.code === '99458' &&
      billingEntry.eligibility.next?.alreadyEligibleCount >= 1
    ) {
      row.push(text)
      return
    }

    if (billingEntry.remainingDays) {
      text += '; '
    }

    // We navigate through each key on the 'next' object to display the missing requirements.
    // Usually, these are 'monitoring time', 'live interactions', etc.
    nextObjectKeys.forEach((nextKey, nextKeyIndex, nextKeyArray) => {
      const remainingMetricString = this.getRemainingMetricString(
        billingEntry.eligibility.next[nextKey].remainingRaw ||
          billingEntry.eligibility.next[nextKey].remaining,
        nextKey
      )

      if (!remainingMetricString) {
        return
      }

      text += `${remainingMetricString}`

      if (nextKeyIndex !== nextKeyArray.length - 1) {
        text += '; '
      }
    })
    row.push(text)
  }

  private getRemainingMetricString(value: number, type: string): string {
    switch (type) {
      case 'transmissions':
        return `${value} more device transmissions needed`

      case 'liveInteraction':
        return `${value} more live interactions (call/visit) needed`

      case 'monitoring':
        return `${value} minutes more of monitoring needed`
    }

    return ''
  }

  private sortHandler(): Partial<FetchCareManagementBillingSnapshotRequest> {
    if (!this.sort.direction || !this.sort.active) {
      return
    }

    return {
      sort: {
        property: this.sort.active,
        dir: this.sort.direction
      }
    } as Partial<FetchCareManagementBillingSnapshotRequest>
  }

  private recoverPagination(): void {
    const rawPagination = window.localStorage.getItem(
      STORAGE_RPM_BILLING_PAGINATION
    )

    if (!rawPagination) {
      return
    }

    const pagination = JSON.parse(rawPagination)

    if (pagination.organization === this.context.organizationId) {
      this.paginator.pageIndex = pagination.page
      this.source.pageIndex = pagination.page
      this.cdr.detectChanges()
      this.refresh$.next()
    } else {
      window.localStorage.removeItem(STORAGE_RPM_BILLING_PAGINATION)
    }
  }

  public onScroll(): void {
    const columnIndex = this.getColumnIndexByScroll(
      this.tableContainer.nativeElement.scrollLeft
    )

    window.localStorage.setItem(
      STORAGE_RPM_BILLING_COLUMN_INDEX,
      columnIndex.toString()
    )
  }

  private getColumnIndexByScroll(scroll: number): number {
    let lastPosition = 0

    for (let i = 0; i < this.tableColumns.length; i += 1) {
      const column = this.tableColumns.get(i)

      if (column.nativeElement.classList.contains('sticky-column')) {
        continue
      }

      const elementPosition = lastPosition + column.nativeElement.clientWidth

      if (lastPosition <= scroll && scroll < elementPosition) {
        return i
      }

      lastPosition += column.nativeElement.clientWidth
    }

    return 0
  }

  private scrollToColumnIndex() {
    const columnIndexRaw = window.localStorage.getItem(
      STORAGE_RPM_BILLING_COLUMN_INDEX
    )

    if (!columnIndexRaw) {
      return
    }

    const columnIndex = parseInt(columnIndexRaw, 10)

    const tableColumns = this.tableColumns.toArray().slice(0, columnIndex)

    const scrollTo = tableColumns.reduce((width, column) => {
      if (column.nativeElement.classList.contains('sticky-column')) {
        return width
      }

      return width + column.nativeElement.clientWidth
    }, 0)

    this.tableContainer.nativeElement.scrollTo({ left: scrollTo })
  }

  private refresh(): void {
    if (this.paginator.pageIndex === 0) {
      this.refresh$.next()
      return
    }

    this.paginator.firstPage()
  }

  public async onChangeSupervisingProvider(summary: RPMStateSummaryEntry) {
    await this.careManagementPermissions.init(
      summary.account.id,
      this.selectedClinic?.id
    )
    const rpmEntry = new RPMStateEntry({
      rpmState: {
        ...summary.state,
        account: summary.account,
        organization: summary.organization
      }
    })

    const careEntries = this.careManagementPermissions.careEntries

    const activeCareEntries = this.careManagementPermissions.activeCareEntries

    const permissions = this.careManagementPermissions.permissions
    const restrictions = this.careManagementPermissions.restrictions

    this.dialog
      .open(RPMStatusDialog, {
        data: {
          accessibleOrganizations: permissions,
          inaccessibleOrganizations: restrictions,
          careEntries,
          rpmEntry,
          activeCareEntries,
          initialStatus: 'edit_supervising_provider',
          closeAfterChange: true
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter(({ rpmEntry }) => rpmEntry?.rpmState?.supervisingProvider))
      .subscribe(({ rpmEntry }) => {
        if (summary.state.isActive) {
          summary.state.supervisingProvider =
            rpmEntry.rpmState.supervisingProvider
          this.source.updateItem(summary)
        }
      })
  }

  public findBilling(
    billings: RPMStateSummaryBilling[],
    code
  ): RPMStateSummaryBilling {
    return billings.find((billing) => billing.code === code)
  }
}
