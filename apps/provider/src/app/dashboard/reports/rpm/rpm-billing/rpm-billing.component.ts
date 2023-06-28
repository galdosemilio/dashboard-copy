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
import { chain, times, isEmpty, countBy } from 'lodash'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { firstValueFrom, Subject } from 'rxjs'
import { debounceTime, filter, map } from 'rxjs/operators'
import {
  ReportsCriteria,
  ReportsDatabase,
  RPMBillingDataSource
} from '../../services'
import { criteriaSelector, ReportsState } from '../../store'
import {
  RPM_SINGLE_TIME_CODES,
  RPMStateSummaryBilling,
  RPMStateSummaryEntry
} from '../models'
import {
  STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
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
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { RPMMonthlySummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchRPMMonthlyBillingSummaryResponse.interface'
import { CareManagementStateSummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'
import { CareManagementBillingMonthItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingMonthResponse.interface'

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
  public csvSeparator = ','
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
  public selectedServiceTypeId: string = this.getServiceTypeFromStorage()
  public selectedServiceType: CareManagementServiceType

  private timezones: Array<TimezoneResponse> = this.timezone.fetch()
  private refresh$: Subject<void> = new Subject<void>()
  private selectedClinic$ = new Subject<OrganizationEntity | null>()
  private selectedSupervisingProvider$ =
    new Subject<SelectOption<number> | null>()

  get cptCodes() {
    return chain(this.careManagementService.billingCodes)
      .filter((entry) => entry.serviceType.id === this.selectedServiceTypeId)
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
    private careManagementService: CareManagementService
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
      case 'monitoring':
        return this.downloadMonitoringReport()
      case 'billing':
        return this.downloadBillingReport()
    }
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
    headers: string,
    firstRow: string,
    secondRow?: string
  ) {
    if (externalIdentifierNames.length > 0) {
      firstRow += this.csvSeparator
      headers += this.csvSeparator
      if (secondRow) {
        secondRow += this.csvSeparator
      }
    }

    externalIdentifierNames.forEach((entry, index) => {
      if (secondRow) {
        firstRow += ',,'
        secondRow += ',Identifier,'
      } else {
        firstRow += ',Identifier,'
      }

      headers += 'ID,Name,Value'

      if (index + 1 !== externalIdentifierNames.length) {
        firstRow += this.csvSeparator
        headers += this.csvSeparator
        if (secondRow) {
          secondRow += this.csvSeparator
        }
      }
    })

    return {
      firstRow,
      secondRow,
      headers
    }
  }

  private addExternalIdentifierValues(
    externalIdentifierNames: string[],
    externalIdentifiers: ExternalIdentifier[]
  ) {
    if (externalIdentifierNames.length === 0) {
      return ''
    }

    let values = this.csvSeparator
    const externalIdentifierNameGroup = countBy(externalIdentifierNames)
    const entries = Object.entries(externalIdentifierNameGroup)
    entries.forEach(([name, count], eIndex) => {
      const filteredExternalIdentifiers =
        externalIdentifiers?.filter((item) => item.name === name) || []

      times(count, (index) => {
        const externalIdentifier = filteredExternalIdentifiers[index]

        if (externalIdentifier) {
          values += externalIdentifier.id + this.csvSeparator
          values += externalIdentifier.name + this.csvSeparator
          values += externalIdentifier.value
        } else {
          values += ',,'
        }
        if (index + 1 !== count) {
          values += this.csvSeparator
        }
      })

      if (eIndex + 1 !== entries.length) {
        values += this.csvSeparator
      }
    })

    return values
  }

  private async downloadMonitoringReport(): Promise<void> {
    try {
      this.isLoading = true
      const criteria = this.source.args
      const rawResponse =
        await this.database.fetchCareManagementBillingSnapshot({
          ...criteria,
          limit: 'all',
          offset: 0
        })

      const allBillings = this.careManagementService.billingCodes
        .filter((code) => code.serviceType.id === this.selectedServiceTypeId)
        .map(
          (key) =>
            ({
              code: key.value,
              eligibility: {}
            } as any)
        )

      const res: RPMStateSummaryEntry[] = rawResponse.data.map(
        (element) =>
          new RPMStateSummaryEntry(
            element,
            allBillings,
            this.careManagementService.trackableCptCodes[
              this.selectedServiceTypeId
            ],
            this.criteria.asOf
          )
      )

      if (!res.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const filename = `${this.selectedServiceType.name}_${moment(
        criteria.asOf
      ).format('MMM_YYYY')}.csv`
      let csv = ''

      const externalIdentifierNames = this.getExternalIdentifierNames(res)

      const currentAsOf = moment(this.criteria.asOf).isSameOrAfter(
        moment(),
        'day'
      )
        ? moment()
        : moment(this.criteria.asOf).endOf('day')

      let firstRow = `"As of: ${currentAsOf.format('MMM D, YYYY')}"${
        this.csvSeparator
      }`

      firstRow += ',,,,,,,,,,,'

      let secondRow = ''
      if (this.timezoneName) {
        secondRow += `GENERATED IN ${this.timezoneName.toUpperCase()},,,,,,,,,,,`
      }

      this.cptCodes.forEach((billingCode, index) => {
        firstRow += `"${billingCode}"${this.csvSeparator}"${billingCode}"${
          index === this.cptCodes.length - 1 ? '' : this.csvSeparator
        }`

        if (secondRow) {
          secondRow += this.csvSeparator + this.csvSeparator
        }
      })

      let headers =
        'ID' +
        this.csvSeparator +
        'First Name' +
        this.csvSeparator +
        'Last Name' +
        this.csvSeparator +
        'Date of Birth' +
        this.csvSeparator +
        'Device Type' +
        this.csvSeparator +
        'Primary Diagnosis' +
        this.csvSeparator +
        'Secondary Diagnosis' +
        this.csvSeparator +
        'Supervising Provider' +
        this.csvSeparator +
        'Organization ID' +
        this.csvSeparator +
        'Organization Name' +
        this.csvSeparator +
        'Status' +
        this.csvSeparator +
        'Activation Date' +
        this.csvSeparator

      // We iterate through each billing entry code to set up the headers
      this.cptCodes.forEach((code, index) => {
        headers += `"Latest Claim Date"` + this.csvSeparator
        headers += `"Next Claim Requirements"`
        if (index !== this.cptCodes.length - 1) {
          headers += this.csvSeparator
        }
      })

      const headerData = this.addExternalIdentifierHeaders(
        externalIdentifierNames,
        headers,
        firstRow,
        secondRow
      )

      firstRow = headerData.firstRow
      secondRow = headerData.secondRow
      headers = headerData.headers

      let dataRows = ''

      // We just go through each row and fill the cells
      res.forEach((entry) => {
        dataRows +=
          `"${entry.account.id}"` +
          this.csvSeparator +
          `"${entry.account.firstName}"` +
          this.csvSeparator +
          `"${entry.account.lastName}"` +
          this.csvSeparator +
          `"${moment(entry.account.dateOfBirth).format('MM/DD/YYYY')}"` +
          this.csvSeparator +
          `"${entry.device.name}"` +
          this.csvSeparator +
          `"${
            (entry.state?.isActive && entry.state?.diagnosis?.primary) || ''
          }"` +
          this.csvSeparator +
          `"${
            (entry.state?.isActive && entry.state?.diagnosis?.secondary) || ''
          }"` +
          this.csvSeparator +
          `"${
            entry.state?.isActive && entry.state?.supervisingProvider
              ? `${entry.state?.supervisingProvider.firstName} ${entry.state?.supervisingProvider.lastName}`
              : ''
          }"` +
          this.csvSeparator +
          `"${entry.organization.id}"` +
          this.csvSeparator +
          `"${entry.organization.name}"` +
          this.csvSeparator +
          `"${entry.state?.isActive ? 'Active' : 'Inactive'}"` +
          this.csvSeparator +
          `"${
            entry.state?.isActive
              ? moment(entry.state.startedAt).format('MM/DD/YYYY')
              : 'No'
          }"` +
          this.csvSeparator

        this.cptCodes.forEach((code, index) => {
          const billingEntry = entry.billing.find(
            (billing) => billing.code === code
          )
          if (billingEntry) {
            dataRows += this.getRPMBillingEntryContent(billingEntry, entry)
          } else {
            dataRows += 'N/A' + this.csvSeparator + 'N/A'
          }

          if (index !== this.cptCodes.length - 1) {
            dataRows += this.csvSeparator
          }
        })

        dataRows += this.addExternalIdentifierValues(
          externalIdentifierNames,
          entry.externalIdentifiers
        )

        dataRows += '\r\n'
      })

      csv += firstRow + '\r\n'
      if (secondRow) {
        csv += secondRow + '\r\n'
      }
      csv += headers + '\r\n'
      csv += dataRows
      csv +=
        `\r\n"${currentAsOf.format('dddd, MMM D, YYYY HH:mm:ss A [GMT]Z')}"` +
        this.csvSeparator

      CSV.toFile({ content: csv, filename })
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

      let csv = ''

      const currentAsOf = moment(asOfDate)

      let firstRow = `"As of: ${currentAsOf.format('MMM, YYYY')}"${
        this.csvSeparator
      }`
      firstRow += ',,,,,,,,,,,'

      let secondRow = ''
      if (this.timezoneName) {
        secondRow += `GENERATED IN ${this.timezoneName.toUpperCase()},,,,,,,,,,,`
      }

      this.cptCodes.forEach((code, index) => {
        firstRow += `"${code}"${
          index === this.cptCodes.length - 1 ? '' : this.csvSeparator
        }`

        if (secondRow) {
          secondRow += this.csvSeparator
        }
      })

      let headers =
        'ID' +
        this.csvSeparator +
        'First Name' +
        this.csvSeparator +
        'Last Name' +
        this.csvSeparator +
        'Date of Birth' +
        this.csvSeparator +
        'Device Type' +
        this.csvSeparator +
        'Primary Diagnosis' +
        this.csvSeparator +
        'Secondary Diagnosis' +
        this.csvSeparator +
        'Supervising Provider' +
        this.csvSeparator +
        'Organization ID' +
        this.csvSeparator +
        'Organization Name' +
        this.csvSeparator +
        'Status' +
        this.csvSeparator +
        'Activation Date' +
        this.csvSeparator

      this.cptCodes.forEach((billingCode, index) => {
        headers += `"Claim Date"${
          index === this.cptCodes.length - 1 ? '' : this.csvSeparator
        }`
      })

      const headerData = this.addExternalIdentifierHeaders(
        externalIdentifierNames,
        headers,
        firstRow,
        secondRow
      )

      firstRow = headerData.firstRow
      secondRow = headerData.secondRow
      headers = headerData.headers

      let dataRows = ''

      for (const entry of data) {
        const eligibilityGroup = chain(entry.eligibility)
          .groupBy('code')
          .value()

        dataRows +=
          `"${entry.account.id}"` +
          this.csvSeparator +
          `"${entry.account.firstName}"` +
          this.csvSeparator +
          `"${entry.account.lastName}"` +
          this.csvSeparator +
          `"${moment.utc(entry.account.dateOfBirth).format('MM/DD/YYYY')}"` +
          this.csvSeparator +
          `"${entry.state?.billable?.plan?.name || ''}"` +
          this.csvSeparator +
          `"${entry.state?.billable?.diagnosis?.primary || ''}"` +
          this.csvSeparator +
          `"${entry.state?.billable?.diagnosis?.secondary || ''}"` +
          this.csvSeparator +
          `"${
            entry.state?.billable?.supervisingProvider
              ? `${entry.state.billable.supervisingProvider.firstName} ${entry.state.billable.supervisingProvider.lastName}`
              : ''
          }"` +
          this.csvSeparator +
          `"${entry.organization?.state?.id || ''}"` +
          this.csvSeparator +
          `"${entry.organization?.state?.name || ''}"` +
          this.csvSeparator +
          `"${entry.state?.current?.isActive ? 'Active' : 'Inactive'}"` +
          this.csvSeparator +
          `"${
            entry.state?.billable?.isActive
              ? moment(entry.state.billable.startedAt).format('MM/DD/YYYY')
              : 'No'
          }"` +
          this.csvSeparator

        this.cptCodes.forEach((billingCode, index) => {
          if (eligibilityGroup[billingCode]?.length) {
            dataRows += `"${moment(
              eligibilityGroup[billingCode][0].eligibleAt
            ).format('MM/DD/YYYY')}"`
          } else {
            dataRows += `"N/A"`
          }

          if (index !== this.cptCodes.length - 1) {
            dataRows += this.csvSeparator
          }
        })

        dataRows += this.addExternalIdentifierValues(
          externalIdentifierNames,
          entry.externalIdentifiers
        )

        dataRows += '\r\n'
      }

      csv += firstRow + '\r\n'
      if (secondRow) {
        csv += secondRow + '\r\n'
      }
      csv += headers + '\r\n'
      csv += dataRows

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

  private getServiceTypeFromStorage(): string {
    try {
      const serviceType = window.localStorage.getItem(
        STORAGE_CARE_MANAGEMENT_SERVICE_TYPE
      )
      if (!serviceType) {
        throw new Error('No service type in storage')
      }

      this.selectedServiceTypeId = serviceType
      this.selectedServiceType =
        this.context.user.careManagementServiceTypes.find(
          (entry) => entry.id === serviceType
        )
      return serviceType
    } catch (error) {
      console.error(error)
    }
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
    billingEntry,
    entry: RPMStateSummaryEntry
  ): string {
    let csv = ''
    // Latest Eligibility
    csv +=
      `"${
        billingEntry.eligibility.last
          ? moment(billingEntry.eligibility.last.timestamp).format('MM/DD/YYYY')
          : 'N/A'
      }"` + this.csvSeparator

    // Next Eligibility
    if (
      !billingEntry.eligibility.next ||
      !entry.state?.isActive ||
      (billingEntry.code === '99458' &&
        (billingEntry.eligibility.next?.alreadyEligibleCount ?? 0) >= 1 &&
        !billingEntry.remainingDays)
    ) {
      csv +=
        billingEntry.hasClaims &&
        RPM_SINGLE_TIME_CODES.indexOf(billingEntry.code) !== -1
          ? '"N/A - once per episode of care"'
          : '"N/A"'
    } else {
      // Means we have next eligibility requirements that we should display
      csv += '"'

      const nextObjectKeys = Object.keys(billingEntry.eligibility.next).filter(
        (key) =>
          key !== 'earliestEligibleAt' &&
          billingEntry.eligibility.next[key]?.remaining
      )

      // Previous code requirements (happens between 99458 and 99457, for example)
      if (billingEntry.hasCodeRequirements) {
        billingEntry.eligibility.next.relatedCodeRequirementsNotMet.forEach(
          (code, index, array) => {
            csv += `${code} requirements not satisfied`

            if (index + 1 < array.length) {
              csv += '; '
            }
          }
        )

        if (billingEntry.remainingDays || nextObjectKeys.length) {
          csv += '; '
        }
      }

      // Remaining days
      if (billingEntry.remainingDays) {
        csv += `${billingEntry.remainingDays} more calendar days`
      }

      // The only notable condition here is 99458, that one means
      // that if there is an alreadyEligibleCount [meaning that the MONITORING TIME has
      // been completed, not that the iteration is ACTUALLY eligibile.
      // Don't be fooled by the name of the property like me!], then the requirements
      // that appear as part of this object are not for 99458 x1 but for 99458 x2
      // and that we should skip them.
      if (!nextObjectKeys.length) {
        csv += '"'
      } else if (
        billingEntry.code === '99458' &&
        billingEntry.eligibility.next?.alreadyEligibleCount >= 1
      ) {
        csv += `"`
        return csv
      } else if (billingEntry.remainingDays) {
        csv += '; '
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
          if (nextKeyIndex === nextKeyArray.length - 1) {
            csv += '"'
          }
          return
        }

        csv += `${remainingMetricString}`

        if (nextKeyIndex === nextKeyArray.length - 1) {
          csv += '"'
        } else {
          csv += '; '
        }
      })
    }

    return csv
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

  public onChangeSupervisingProvider(summary: any) {
    const rpmEntry = new RPMStateEntry({
      rpmState: {
        ...summary.state,
        account: summary.account,
        organization: summary.organization
      }
    })

    this.dialog
      .open(RPMStatusDialog, {
        data: {
          accessibleOrganizations: [],
          inaccessibleOrganizations: [],
          mostRecentEntry: rpmEntry,
          initialStatus: 'edit_supervising_provider',
          closeAfterChange: true
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((entry) => entry?.rpmState?.supervisingProvider))
      .subscribe((entry: RPMStateEntry) => {
        summary.rpm.supervisingProvider = entry.rpmState.supervisingProvider
        this.source.updateItem(summary)
      })
  }

  public findBilling(
    billings: RPMStateSummaryBilling[],
    code
  ): RPMStateSummaryBilling {
    return billings.find((billing) => billing.code === code)
  }
}
