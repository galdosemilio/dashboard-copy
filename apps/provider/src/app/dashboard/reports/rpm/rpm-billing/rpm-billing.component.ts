import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatSort } from '@coachcare/material'
import { Router } from '@angular/router'
import { ClosePanel, OpenPanel } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import { WalkthroughService } from '@app/service/walkthrough'
import { CcrPaginator } from '@app/shared'
import {
  AccountTypeId,
  FetchRPMBillingSummaryRequest
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { select, Store } from '@ngrx/store'
import { get, isEmpty } from 'lodash'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
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

@UntilDestroy()
@Component({
  selector: 'app-reports-rpm-billing',
  templateUrl: './rpm-billing.component.html',
  styleUrls: ['./rpm-billing.component.scss']
})
export class RPMBillingComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginator, { static: true }) paginator: CcrPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

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
  public searchForm: FormGroup
  public statusFilterForm: FormGroup
  public source: RPMBillingDataSource
  public totalCount: number

  private refresh$: Subject<void> = new Subject<void>()

  constructor(
    private context: ContextService,
    private database: ReportsDatabase,
    private fb: FormBuilder,
    private notify: NotifierService,
    private router: Router,
    private store: Store<ReportsState>,
    private walkthrough: WalkthroughService
  ) {}

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
  }

  public ngOnInit(): void {
    this.walkthrough.checkGuideState('rpm')
    this.store.dispatch(new ClosePanel())
    this.createStatusFilterForm()
    this.source = new RPMBillingDataSource(
      this.database,
      this.notify,
      this.paginator,
      this.sort
    )
    this.source.addDefault({ status: 'active' } as any)
    this.source.addOptional(
      this.statusFilterForm.controls.status.valueChanges.pipe(
        debounceTime(100)
      ),
      () => ({
        status: this.statusFilterForm.value.status || 'all'
      })
    )
    this.source.addOptional(
      this.searchForm.controls.query.valueChanges.pipe(debounceTime(500)),
      () => ({ query: this.searchForm.value.query || undefined })
    )
    this.source.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
    this.source.addOptional(this.refresh$, () => {
      const selectedDate = moment(this.criteria.asOf)

      return {
        asOf: selectedDate.isSameOrAfter(moment(), 'day')
          ? undefined
          : selectedDate.endOf('day').toISOString()
      }
    })
    this.source.change$.pipe(untilDestroyed(this)).subscribe(() => {
      this.totalCount = this.source.totalCount ?? 0
    })

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.criteria.asOf = reportsCriteria.endDate
          this.paginator.firstPage()
          this.refresh$.next()
        }
      })

    this.refresh$.next()
  }

  public clearSearchForm(): void {
    this.searchForm.reset()
  }

  public async downloadCSV(): Promise<void> {
    try {
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
        return this.notify.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
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

      csv += ',,,,,,,,'

      csv += `"99453"${this.csvSeparator}"99453"${this.csvSeparator}`
      csv += `"99454"${this.csvSeparator}"99454"${this.csvSeparator}`
      csv += `"99457"${this.csvSeparator}"99457"${this.csvSeparator}`
      csv += `"99458 x1"${this.csvSeparator}"99458 x1"${this.csvSeparator}`
      csv += `"99458 x2"${this.csvSeparator}"99458 x2"`

      csv += '\r\n'

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
        'Organization ID' +
        this.csvSeparator +
        'Organization Name' +
        this.csvSeparator +
        'Status' +
        this.csvSeparator +
        'Activation Date' +
        this.csvSeparator

      res[0].billing.forEach((billingEntry, billingEntryIndex) => {
        const columnMap = RPM_CODE_COLUMNS[billingEntry.code]

        if (!columnMap) {
          return
        }

        csv += `"Latest Claim Date"` + this.csvSeparator
        csv += `"Next Claim Requirements"`

        columnMap.forEach((columnInfo, index, columns) => {
          csv +=
            `"${columnInfo.column}"` +
            (index + 1 === columns.length ? '' : this.csvSeparator)
        })

        if (billingEntryIndex === res[0].billing.length - 1) {
          csv += `${this.csvSeparator}"Latest Claim Date"` + this.csvSeparator
          csv += `"Next Claim Requirements"`
          csv += '\r\n'
        } else {
          csv += this.csvSeparator
        }
      })

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
          `"${entry.organization.id}"` +
          this.csvSeparator +
          `"${entry.organization.name}"` +
          this.csvSeparator +
          `"${entry.rpm.isActive ? 'Active' : 'Inactive'}"` +
          this.csvSeparator +
          `"${
            entry.rpm.isActive
              ? moment(entry.rpm.changedAt).format('MM/DD/YYYY')
              : 'No'
          }"` +
          this.csvSeparator

        entry.billing
          .filter((billingEntry) => billingEntry.code !== '99458')
          .forEach((billingEntry) => {
            csv += this.getRPMBillingEntryContent(billingEntry, entry)

            csv += this.csvSeparator
          })

        const lastCodeEntry = entry.billing[3]

        csv += this.getRPMBillingEntryContent(lastCodeEntry, entry)

        csv += this.csvSeparator

        csv += `"${
          lastCodeEntry.eligibility.last?.count > 1
            ? moment(lastCodeEntry.eligibility.last.timestamp).format(
                'MM/DD/YYYY'
              )
            : 'N/A'
        }"${this.csvSeparator}`

        csv += `"`

        const previousConditionsMet =
          lastCodeEntry.eligibility.next?.alreadyEligibleCount >= 1 &&
          !lastCodeEntry.hasCodeRequirements &&
          !lastCodeEntry.remainingDays

        csv += `${
          !previousConditionsMet ? '99458 x1 requirements not satisfied; ' : ''
        }`

        if (lastCodeEntry.remainingDays) {
          csv += `${lastCodeEntry.remainingDays} more calendar days`
        }

        csv += lastCodeEntry.eligibility.next.monitoring.remaining
          ? `; ${this.getRemainingMetricString(
              lastCodeEntry.eligibility.next.monitoring.remaining,
              'monitoring'
            )}`
          : ''
        csv += '"\r\n'
      })

      csv +=
        `\r\n"${currentAsOf.format('dddd, MMM D, YYYY HH:mm:ss A [GMT]Z')}"` +
        this.csvSeparator

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      this.notify.error(error)
    }
  }

  public onStatusFilterChange($event: Event): void {
    if ($event.type === 'change') {
      this.paginator.firstPage()
      this.statusFilterForm.controls.status.setValue(
        ($event.target as HTMLSelectElement).value
      )
    }
  }

  public openPatientProfile(rpmStateEntry: RPMStateSummaryEntry): void {
    this.router.navigate([
      this.context.getProfileRoute({
        ...rpmStateEntry.account,
        accountType: AccountTypeId.Client
      })
    ])
  }

  private createStatusFilterForm(): void {
    this.statusFilterForm = this.fb.group({ status: ['active'] })
    this.searchForm = this.fb.group({ query: [''] })
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

    csv +=
      `"${
        billingEntry.eligibility.last
          ? moment(billingEntry.eligibility.last.timestamp).format('MM/DD/YYYY')
          : 'N/A'
      }"` + this.csvSeparator

    if (!billingEntry.eligibility.next || !entry.rpm.isActive) {
      csv +=
        billingEntry.hasClaims &&
        RPM_SINGLE_TIME_CODES.indexOf(billingEntry.code) !== -1
          ? '"N/A - once per episode of care"'
          : '"N/A"'
    } else {
      csv += '"'

      const nextObjectKeys = Object.keys(billingEntry.eligibility.next).filter(
        (key) =>
          key !== 'earliestEligibleAt' &&
          billingEntry.eligibility.next[key].remaining
      )

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

      if (billingEntry.remainingDays) {
        csv += `${billingEntry.remainingDays} more calendar days`
      }

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
}
