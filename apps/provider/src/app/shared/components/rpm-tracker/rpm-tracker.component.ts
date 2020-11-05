import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import {
  ContextService,
  NotifierService,
  TimeTrackerService
} from '@app/service'
import {
  AccountAccessData,
  RPMStateSummaryBillingItem,
  RPMStateSummaryItem
} from '@coachcare/npm-api'
import { get } from 'lodash'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { RPM } from 'selvera-api'
import { TRACKABLE_RPM_CODES, TrackableRPMCodeEntry } from './model'

interface CodeAndTracking {
  trackableCode: TrackableRPMCodeEntry
  billingItem: RPMStateSummaryBillingItem
}

@Component({
  selector: 'app-rpm-tracker',
  templateUrl: './rpm-tracker.component.html',
  styleUrls: ['./rpm-tracker.component.scss']
})
export class RPMTrackerComponent implements OnDestroy, OnInit {
  public account: AccountAccessData
  public currentCodeAndTracking: CodeAndTracking
  public currentCodeString: string
  public currentIteration = 1
  public iterationAmountArray: string[] = []
  public showStatusPanel = false
  public showTimer = false
  public timerDisplay = '00:00'
  public timeTrackingComplete = false

  private set iterationAmount(amount: number) {
    this._iterationAmount = amount > 0 ? amount : 0
    this._iterationAmount = Math.min(
      this._iterationAmount,
      this.currentCodeAndTracking.trackableCode.maxEligibleAmount
    )
    this.iterationAmountArray = new Array(
      Math.min(
        this._iterationAmount + 1,
        this.currentCodeAndTracking.trackableCode.maxEligibleAmount
      )
    ).fill('')
    this.currentIteration = Math.min(
      this.currentCodeAndTracking.trackableCode.maxEligibleAmount,
      this._iterationAmount + 1
    )
  }

  private get iterationAmount(): number {
    return this._iterationAmount
  }

  private set seconds(seconds: number) {
    this._seconds = seconds || 0

    const hoursResidue = this._seconds % 3600
    const minutes = Math.floor(hoursResidue / 60)
    const secs = hoursResidue % 60

    this.timerDisplay = `${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  private get seconds(): number {
    return this._seconds
  }

  private _iterationAmount = 0
  private requiredIterationSeconds = 1200
  private _seconds = 0
  private timerInterval

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private notifier: NotifierService,
    private rpm: RPM,
    private timeTracker: TimeTrackerService
  ) {
    this.timerHandler = this.timerHandler.bind(this)
    this.resolveAccountRPMStatus = this.resolveAccountRPMStatus.bind(this)
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.context.account$.pipe(untilDestroyed(this)).subscribe((account) => {
      this.account = account
      this.resolveAccountRPMStatus(account)
    })
  }

  public onForceClosePanel(): void {
    this.showStatusPanel = false
  }

  public toggleRPMStatusPanel(): void {
    this.showStatusPanel = !this.showStatusPanel
  }

  private async handleSecondPassing(): Promise<void> {
    try {
      if (this.seconds < this.requiredIterationSeconds) {
        return
      }

      this.iterationAmount = Math.min(
        this.iterationAmount + 1,
        this.currentCodeAndTracking.trackableCode.maxEligibleAmount
      )

      this.pauseTimer()
      await this.timeTracker.forceCommit()
      this.resolveAccountRPMStatus(this.account)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private pauseTimer(): void {
    if (!this.timerInterval) {
      return
    }

    clearInterval(this.timerInterval)
    delete this.timerInterval
  }

  private async resolveAccountRPMStatus(
    account: AccountAccessData
  ): Promise<void> {
    try {
      if (!account) {
        return
      }

      this.timeTrackingComplete = false

      const response = await this.rpm.getList({
        organization: this.context.organizationId,
        account: account.id,
        limit: 1,
        offset: 0
      })

      if (!response.data.length) {
        return
      }

      if (response.data.shift().isActive) {
        await this.resolveRPMBillingStatus(account)
      } else {
        this.stopTimer()
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private resolveCurrentRPMBillingCode(
    stateSummaryItem: RPMStateSummaryItem
  ): CodeAndTracking {
    const trackableCodes = Object.values(TRACKABLE_RPM_CODES)
    let billingItem: RPMStateSummaryBillingItem
    let trackableCode: TrackableRPMCodeEntry

    trackableCodes.some((trackCode) => {
      const trackCodeOverride = trackCode.displayedCode || trackCode.code

      const foundCodeInEntry = stateSummaryItem.billing.find(
        (billingEntry) => billingEntry.code === trackCodeOverride
      )

      const requiredSeconds = get(
        foundCodeInEntry,
        'eligibility.next.monitoring.total.seconds.required'
      )
      const trackedSeconds = get(
        foundCodeInEntry,
        'eligibility.next.monitoring.total.seconds.tracked'
      )

      if (
        !foundCodeInEntry ||
        !foundCodeInEntry.eligibility.next ||
        (requiredSeconds && trackedSeconds && trackedSeconds >= requiredSeconds)
      ) {
        return
      }

      billingItem = foundCodeInEntry
      trackableCode = trackCode
      return true
    })

    if (!billingItem) {
      billingItem =
        stateSummaryItem.billing[stateSummaryItem.billing.length - 1]
      trackableCode = trackableCodes[1]
    }

    return { billingItem, trackableCode }
  }

  private async resolveRPMBillingStatus(
    account: AccountAccessData
  ): Promise<void> {
    try {
      if (!account) {
        return
      }

      const response = await this.database.fetchRPMBillingReport({
        account: account.id,
        organization: this.context.organizationId,
        limit: 1,
        offset: 0
      })

      if (!response.data.length) {
        return
      }

      const rpmBillingReportEntry = response.data.shift()
      this.currentCodeAndTracking = this.resolveCurrentRPMBillingCode(
        rpmBillingReportEntry
      )
      this.requiredIterationSeconds =
        get(
          this.currentCodeAndTracking,
          'billingItem.eligibility.next.monitoring.total.seconds.required'
        ) || 1200

      this.currentCodeString =
        this.currentCodeAndTracking.trackableCode.displayedCode ||
        this.currentCodeAndTracking.trackableCode.code

      if (this.currentCodeAndTracking.trackableCode.requiresTimeTracking) {
        this.resolveTimerStartTime(this.currentCodeAndTracking)

        this.showTimer = true
        this.cdr.detectChanges()

        if (this.seconds < this.requiredIterationSeconds) {
          this.startTimer()
        } else {
          this.timeTrackingComplete = true
        }
      }
    } catch (error) {
      console.error(error)
      this.notifier.error(error)
    }
  }

  private resolveTimerStartTime(codeAndTracking: CodeAndTracking): void {
    switch (codeAndTracking.trackableCode.code) {
      case '99458':
        this.iterationAmount = get(
          codeAndTracking,
          'billingItem.eligibility.next.alreadyEligibleCount',
          codeAndTracking.trackableCode.maxEligibleAmount
        )
        this.seconds = get(
          codeAndTracking,
          'billingItem.eligibility.next.monitoring.total.seconds.tracked',
          get(
            codeAndTracking,
            'billingItem.eligibility.next.monitoring.total.seconds.elapsed',
            1200
          )
        )

        this.seconds = Math.min(this.seconds, this.requiredIterationSeconds)

        break

      case '99453':
      case '99454':
      case '99457':
        this.iterationAmount = 0
        this.seconds = get(
          codeAndTracking,
          'billingItem.eligibility.next.monitoring.total.seconds.tracked'
        )

        if (this.seconds >= this.requiredIterationSeconds) {
          ++this.iterationAmount
        }
        break

      default:
        this.iterationAmount = 0
        this.seconds = 0
        break
    }
  }

  private startTimer(): void {
    if (this.timerInterval) {
      this.stopTimer()
    }

    this.showTimer = true
    this.timerInterval = setInterval(this.timerHandler, 1000)
  }

  private stopTimer(): void {
    if (!this.timerInterval) {
      return
    }

    clearInterval(this.timerInterval)
    delete this.timerInterval

    this.showTimer = false
    this.seconds = 0
  }

  private timerHandler(): void {
    ++this.seconds

    this.handleSecondPassing()

    this.cdr.detectChanges()
  }
}
