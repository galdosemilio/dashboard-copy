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
import { ContextService, NotifierService } from '@app/service'
import {
  FetchRPMBillingSummaryRequest,
  OrganizationEntity,
  PackageOrganization,
  Timezone,
  TimezoneResponse,
  RPM
} from '@coachcare/sdk'
import { SelectOption, _ } from '@app/shared/utils'
import { select, Store } from '@ngrx/store'
import { get, isEmpty } from 'lodash'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'
import {
  ReportsCriteria,
  ReportsDatabase,
  RPMBillingDataSource
} from '../../services'
import { criteriaSelector, ReportsState } from '../../store'
import {
  RPM_CODE_COLUMNS,
  RPM_SINGLE_TIME_CODES,
  RPMStateSummaryEntry
} from '../models'
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
import { CcrTableSortDirective } from '@app/shared'
import { DeviceDetectorService } from 'ngx-device-detector'
import { CSV } from '@coachcare/common/shared'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

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
  public criteria: Partial<FetchRPMBillingSummaryRequest> = {
    asOf: moment().format('YYYY-MM-DD')
  }
  public csvSeparator = ','
  public defaultPageSizeStorageKey = STORAGE_PAGE_SIZE_RPM_BILLING
  public isDesktop: boolean
  public isLoading: boolean
  public isTopLevelAccount = false
  public rows: RPMStateSummaryEntry[] = []
  public searchForm: FormGroup
  public selectedClinic?: OrganizationEntity
  public source: RPMBillingDataSource
  public totalCount: number
  public packages: SelectOption<number>[] = []
  public selectedStatus: string
  public timezoneName: string
  private storageFilter: StorageFilter
  public supervisingProviders: SelectOption<number>[] = []
  public selectedSupervisingProvider: SelectOption<number>

  private timezones: Array<TimezoneResponse> = this.timezone.fetch()
  private refresh$: Subject<void> = new Subject<void>()
  private selectedClinic$ = new Subject<OrganizationEntity | null>()
  private selectedSupervisingProvider$ =
    new Subject<SelectOption<number> | null>()

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
    private rpm: RPM
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
  }

  public ngOnInit(): void {
    this.isDesktop = this.deviceDetector.isDesktop()
    const storageFilterString = localStorage.getItem(STORAGE_PRM_BILLING_FILTER)

    if (storageFilterString) {
      this.storageFilter = JSON.parse(storageFilterString)
      this.selectedStatus = this.storageFilter.status
      this.selectedSupervisingProvider = this.storageFilter.supervisingProvider
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

  public download(superBillDownload: boolean = false): Promise<void> {
    const criteria = this.source.args

    const now = moment()
    const currentAsOf = moment(criteria.asOf).isSameOrAfter(now, 'day')
      ? now
      : moment(criteria.asOf).endOf('day')

    if (
      currentAsOf.isSame(now, 'day') ||
      currentAsOf.isSame(currentAsOf.clone().endOf('month'), 'day')
    ) {
      return superBillDownload
        ? this.downloadSuperbill()
        : this.downloadRPMBill()
    }

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
      .pipe(filter((res) => res))
      .subscribe(() => {
        superBillDownload
          ? void this.downloadSuperbill()
          : void this.downloadRPMBill()
      })
  }

  public async downloadRPMBill(): Promise<void> {
    try {
      this.isLoading = true
      const criteria = this.source.args
      const rawResponse = await this.database.fetchRPMBillingReport({
        ...criteria,
        limit: 'all',
        offset: 0
      })

      const allBillings = Object.keys(RPM_CODE_COLUMNS).map(
        (key) =>
          ({
            code: key,
            eligibility: {}
          } as any)
      )

      const res: RPMStateSummaryEntry[] = rawResponse.data.map(
        (element) =>
          new RPMStateSummaryEntry(element, allBillings, this.criteria.asOf)
      )

      if (!res.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const filename = `RPM_Billing_${moment(criteria.asOf).format(
        'MMM_YYYY'
      )}.csv`
      let csv = ''

      const currentAsOf = moment(this.criteria.asOf).isSameOrAfter(
        moment(),
        'day'
      )
        ? moment()
        : moment(this.criteria.asOf).endOf('day')

      csv += `"As of: ${currentAsOf.format('MMM D, YYYY')}"${this.csvSeparator}`

      csv += ',,,,,,,,,,,'

      csv += `"99453"${this.csvSeparator}"99453"${this.csvSeparator}`
      csv += `"99454"${this.csvSeparator}"99454"${this.csvSeparator}`
      csv += `"99457"${this.csvSeparator}"99457"${this.csvSeparator}`
      csv += `"99458 x1"${this.csvSeparator}"99458 x1"${this.csvSeparator}`
      csv += `"99458 x2"${this.csvSeparator}"99458 x2"`

      csv += '\r\n'

      if (this.timezoneName) {
        csv += `GENERATED IN ${this.timezoneName.toUpperCase()},,,,,,,,,,,,,,,,\r\n`
      }

      csv +=
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
      res[0].billing.forEach((billingEntry, billingEntryIndex) => {
        const columnMap = RPM_CODE_COLUMNS[billingEntry.code]

        // If the column map for the code is not found, it means we don't support the code.
        // We avoid working with it for stability purposes. This has never happened, though.
        if (!columnMap) {
          return
        }

        csv += `"Latest Claim Date"` + this.csvSeparator
        csv += `"Next Claim Requirements"`

        // We iterate through the column map properties to set ADDITIONAL cells per code.
        // This is code currently doesn't run as we were asked to remove any additional cells.
        columnMap.forEach((columnInfo, index, columns) => {
          csv +=
            `"${columnInfo.column}"` +
            (index + 1 === columns.length ? '' : this.csvSeparator)
        })

        // If we're on the last one the codes [99458], we add an additional couple cells.
        // This is because 99458 was split into two column groups: 99458 x1 and 99458 x2.
        if (billingEntryIndex === res[0].billing.length - 1) {
          csv += `${this.csvSeparator}"Latest Claim Date"` + this.csvSeparator
          csv += `"Next Claim Requirements"`
          csv += '\r\n'
        } else {
          csv += this.csvSeparator
        }
      })

      // We just go through each row and fill the cells
      res.forEach((entry) => {
        csv +=
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
          `"${entry.rpm?.diagnosis?.primary || ''}"` +
          this.csvSeparator +
          `"${entry.rpm?.diagnosis?.secondary || ''}"` +
          this.csvSeparator +
          `"${
            entry.rpm?.supervisingProvider
              ? `${entry.rpm?.supervisingProvider.firstName} ${entry.rpm?.supervisingProvider.lastName}`
              : ''
          }"` +
          this.csvSeparator +
          `"${entry.organization.id}"` +
          this.csvSeparator +
          `"${entry.organization.name}"` +
          this.csvSeparator +
          `"${entry.rpm.isActive ? 'Active' : 'Inactive'}"` +
          this.csvSeparator +
          `"${
            entry.rpm.isActive
              ? moment(entry.rpm.startedAt).format('MM/DD/YYYY')
              : 'No'
          }"` +
          this.csvSeparator

        // We avoid letting the generic logic render the 99458's data since
        // that code is now a special case and is handled manually.
        entry.billing
          .filter((billingEntry) => billingEntry.code !== '99458')
          .forEach((billingEntry) => {
            csv += this.getRPMBillingEntryContent(billingEntry, entry)

            csv += this.csvSeparator
          })

        // This is where we start handling 99458 [x1 and x2] manually
        const lastCodeEntry = entry.billing[3]

        // 99458 x1 [yeah, I know it's equivalent to letting the generic logic handle it but
        // but I separated it for readability]
        csv += this.getRPMBillingEntryContent(lastCodeEntry, entry)

        csv += this.csvSeparator

        // 99458 x2
        csv += `"${
          lastCodeEntry.eligibility.last?.count > 1
            ? moment(lastCodeEntry.eligibility.last.timestamp).format(
                'MM/DD/YYYY'
              )
            : 'N/A'
        }"${this.csvSeparator}`

        csv += `"`

        if (!lastCodeEntry.eligibility.next) {
          csv += 'N/A"\r\n'
          return
        }

        const previousConditionsMet =
          lastCodeEntry.eligibility.next?.alreadyEligibleCount >= 1 &&
          !lastCodeEntry.hasCodeRequirements &&
          !lastCodeEntry.remainingDays

        csv += `${
          !previousConditionsMet ? '99458 x1 requirements not satisfied' : ''
        }`

        // Showing/hiding the semicolon here requires evaluation.
        if (lastCodeEntry.remainingDays) {
          if (!previousConditionsMet) {
            csv += `; `
          }

          csv += `${lastCodeEntry.remainingDays} more calendar days; `
        }

        // Since all that 99458 x2 requires aside from days an 99458 x1 is monitoring
        // time, we check for the remaining time that 99458 code reports.
        // The remaining time reported by the code 99458 is only related to 99458 x2
        // when the previous iteration of 99458 [99458 x1] has been completed.
        csv += lastCodeEntry.eligibility.next?.monitoring?.remaining
          ? `${
              !lastCodeEntry.remainingDays && !previousConditionsMet ? '; ' : ''
            }${this.getRemainingMetricString(
              lastCodeEntry.eligibility.next?.monitoring?.remaining ?? 0,
              'monitoring'
            )}`
          : ''
        csv += '"\r\n'
      })

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

  public async downloadSuperbill(): Promise<void> {
    try {
      this.isLoading = true
      const data = await this.source.fetchSuperbill({
        ...this.source.args,
        limit: 'all',
        offset: 0
      })
      const blob = new Blob([data])
      const link = document.createElement('a')
      const rawFileName = `${this.context.organization.name}__RPM_Superbill`
      link.href = window.URL.createObjectURL(blob)
      link.download = `${rawFileName.replace(/\W/gi, '')}.xlsx`
      link.click()
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
      const res = this.rpm.getSupervisingProviders({
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

    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((values) => {
        this.rows = values
        this.scrollToColumnIndex()
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
    const columnMap = RPM_CODE_COLUMNS[billingEntry.code]

    if (!columnMap) {
      return
    }

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
      !entry.rpm.isActive ||
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

    // The column map handles ADDITIONAL cells. Since we were asked to remove these,
    // they're currently deactivated and this portion of the code doesn't do anything.
    columnMap.forEach((columnInfo, index, columns) => {
      const shownValue = columnInfo.inParent
        ? get(entry, columnInfo.route)
        : get(billingEntry, columnInfo.route)

      csv +=
        `"${
          entry.device.id === '-1' && columnInfo.defaultNoPlan
            ? columnInfo.defaultNoPlan
            : shownValue !== null && shownValue !== undefined
            ? shownValue
            : columnInfo.default
        }"` + (index + 1 === columns.length ? '' : this.csvSeparator)
    })

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

  private sortHandler(): Partial<FetchRPMBillingSummaryRequest> {
    return {
      sort: this.sort.direction
        ? [
            {
              property: this.sort.active || 'firstName',
              dir: this.sort.direction || 'asc'
            }
          ]
        : [
            {
              property: 'firstName',
              dir: 'asc'
            }
          ]
    } as Partial<FetchRPMBillingSummaryRequest>
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
}
