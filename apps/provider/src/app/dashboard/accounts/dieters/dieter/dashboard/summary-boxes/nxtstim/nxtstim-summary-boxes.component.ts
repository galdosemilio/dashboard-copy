import { Component, OnInit } from '@angular/core'
import {
  AccountProvider,
  AccSingleResponse,
  DateRange,
  MeasurementDataPointProvider,
  NxtstimMeasurementDataPointSummaryItem,
  NxtstimSummaryKey
} from '@coachcare/sdk'
import { ContextService, NotifierService } from '@app/service'
import * as moment from 'moment-timezone'
import { _ } from '@app/shared'
import { debounceTime, Subject } from 'rxjs'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

interface TimeRangeOption {
  displayValue: string
  value: string
  generator(): DateRange
}

@UntilDestroy()
@Component({
  selector: 'app-nxtstim-dieter-summary-boxes',
  templateUrl: './nxtstim-summary-boxes.component.html',
  styleUrls: ['./nxtstim-summary-boxes.component.scss']
})
export class NxtstimDieterSummaryBoxesComponent implements OnInit {
  public account: AccSingleResponse
  public isLoading = false
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018829432-Viewing-the-Patient-Dashboard'

  private nxtstimStartYear = moment('2022-01-01')
  private summaryItems: NxtstimMeasurementDataPointSummaryItem[] = []
  private refresh$ = new Subject<void>()

  public timeRangeOptions: TimeRangeOption[] = [
    {
      displayValue: _('QUICK_RANGES.LAST_WEEK'),
      value: 'last-week',
      generator: () => ({
        start: moment().startOf('week').subtract(1, 'week').toISOString(),
        end: moment().endOf('week').subtract(1, 'week').toISOString()
      })
    },
    {
      displayValue: _('QUICK_RANGES.LAST_MONTH'),
      value: 'last-month',
      generator: () => ({
        start: moment().subtract(1, 'month').startOf('month').toISOString(),
        end: moment().subtract(1, 'month').endOf('month').toISOString()
      })
    },
    {
      displayValue: _('QUICK_RANGES.THIS_YEAR'),
      value: 'this-year',
      generator: () => ({
        start: moment().startOf('year').toISOString(),
        end: moment().endOf('year').toISOString()
      })
    },
    {
      displayValue: _('QUICK_RANGES.ALL_TIME'),
      value: 'all-time',
      generator: () => ({
        start: this.account
          ? moment
              .unix(
                Math.max(
                  moment(this.account.createdAt).unix(),
                  this.nxtstimStartYear.unix()
                )
              )
              .toISOString()
          : this.nxtstimStartYear.toISOString(),
        end: moment().toISOString()
      })
    }
  ]
  public timeRange = this.timeRangeOptions[0].value

  public get bodyLocationSummary() {
    return this.summaryItems.find(
      (entry) => entry.key === NxtstimSummaryKey.BODY_LOCATION
    )
  }

  public get programSummary() {
    return this.summaryItems.find(
      (entry) => entry.key === NxtstimSummaryKey.PROGRAM
    )
  }

  public get cureIntensitySummary() {
    return this.summaryItems.find(
      (entry) => entry.key === NxtstimSummaryKey.CURE_INTENSITY
    )
  }

  public get sessionDurationSummary() {
    return this.summaryItems.find(
      (entry) => entry.key === NxtstimSummaryKey.SESSION_DURATION
    )
  }

  constructor(
    private context: ContextService,
    private dataPoint: MeasurementDataPointProvider,
    private notifier: NotifierService,
    private accountProvider: AccountProvider
  ) {}

  public ngOnInit(): void {
    void this.resolveSummary()
    void this.resolveAccount()
    this.refresh$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => this.resolveSummary())
  }

  private async resolveSummary() {
    this.isLoading = true
    this.summaryItems = []

    try {
      const res = await this.dataPoint.getNxtstimSummary({
        account: this.context.accountId,
        recordedAt: this.getTimeRange()
      })

      this.summaryItems = res.data
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private async resolveAccount() {
    try {
      this.account = await this.accountProvider.getSingle(
        this.context.accountId
      )
    } catch (err) {
      this.notifier.error(err)
    }
  }

  private getTimeRange() {
    return this.timeRangeOptions
      .find((option) => option.value === this.timeRange)
      ?.generator()
  }

  public refresh() {
    this.refresh$.next()
  }
}
