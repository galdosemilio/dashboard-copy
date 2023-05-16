import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import {
  CareManagementService,
  ContextService,
  GestureService,
  NotifierService,
  TimeTrackerService
} from '@app/service'
import { AccountAccessData, CareManagementState } from '@coachcare/sdk'
import { get } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TrackableBillableCode } from './model'
import { debounceTime, filter } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { GestureClosingDialog } from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import { Subject, merge } from 'rxjs'
import { RPMStateEntry } from '../rpm/models'
import {
  CareManagementStateSummaryItem,
  CareManagementSnapshotBillingItem
} from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'

interface CodeAndTracking {
  trackableCode: TrackableBillableCode
  billingItem: CareManagementSnapshotBillingItem
}

type TimerUnavailableError = 'no-tracking' | 'active-tomorrow' | 'active-6am'

@UntilDestroy()
@Component({
  selector: 'app-rpm-tracker',
  templateUrl: './rpm-tracker.component.html',
  styleUrls: ['./rpm-tracker.component.scss']
})
export class RPMTrackerComponent implements OnDestroy, OnInit {
  @ViewChild('toggleButton') toggleButton: ElementRef
  @ViewChild('statusPanel') statusPanel: ElementRef

  @HostListener('document:click', ['$event'])
  checkClick($event): void {
    if (
      $event.target !== this.toggleButton.nativeElement &&
      !this.statusPanel.nativeElement.contains($event.target)
    ) {
      this.showStatusPanel = false
    }
  }

  @Input()
  set serviceType(_serviceType: string) {
    this._serviceType = _serviceType
    this.serviceType$.next(_serviceType)
  }

  get serviceType(): string {
    return this._serviceType
  }

  @Output() openSettings: EventEmitter<void> = new EventEmitter<void>()

  private _serviceType: string
  private serviceType$ = new Subject<string>()
  public account: AccountAccessData
  public currentCodeAndTracking: CodeAndTracking
  public currentCodeString: string
  public currentIteration = 1
  public iterationAmountArray: string[] = []
  public showStatusPanel = false
  public showTimer = false
  public timerDisplay = '00:00'
  public timeTrackingComplete = false
  public timerUnavailableError?: TimerUnavailableError = 'no-tracking'
  public loading = false

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

    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  private get seconds(): number {
    return this._seconds
  }

  public get requiredIterationSecondsDisplay() {
    if (this.timerUnavailableError === 'active-tomorrow') {
      return '00:00'
    }

    const hoursResidue = (this.requiredIterationSeconds || 0) % 3600
    const minutes = Math.floor(hoursResidue / 60)
    const secs = hoursResidue % 60

    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  private _iterationAmount = 0
  private requiredIterationSeconds = 0
  private _seconds = 0
  private timerInterval

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private gesture: GestureService,
    private notifier: NotifierService,
    private careManagementState: CareManagementState,
    private timeTracker: TimeTrackerService,
    private careManagementService: CareManagementService
  ) {
    this.timerHandler = this.timerHandler.bind(this)
    this.resolveAccountCareSessionStatus =
      this.resolveAccountCareSessionStatus.bind(this)
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    merge([this.context.account$, this.context.organization$])
      .pipe(
        untilDestroyed(this),
        filter(() => !!this.context.account && !!this.context.organization),
        debounceTime(100)
      )
      .subscribe(() => {
        this.account = this.context.account
        void this.resolveAccountCareSessionStatus(this.account)
      })

    this.serviceType$
      .pipe(debounceTime(100))
      .subscribe(() => this.resolveAccountCareSessionStatus(this.account))

    this.gesture.userIdle$
      .pipe(
        untilDestroyed(this),
        filter((idle) => idle)
      )
      .subscribe(() => this.showUserIdleDialog())
  }

  public toggleRPMStatusPanel(): void {
    if (this.loading) {
      return
    }

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
      void this.resolveAccountCareSessionStatus(this.account)
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

  private async resolveAccountCareSessionStatus(
    account: AccountAccessData
  ): Promise<void> {
    try {
      if (!account || !this.serviceType) {
        return
      }
      this.loading = true
      this.timeTrackingComplete = false
      this.currentCodeString = ''
      this.requiredIterationSeconds = 0
      this.timerUnavailableError = undefined

      const response = await this.careManagementState.getList({
        organization: this.context.organizationId,
        serviceType: this.serviceType,
        account: account.id,
        limit: 1,
        offset: 0
      })

      if (!response.data.length) {
        return
      }

      const rpmEntry = new RPMStateEntry({ rpmState: response.data.shift() })

      if (rpmEntry.isActive && !rpmEntry.pending) {
        await this.resolveRPMBillingStatus(account)
      } else {
        this.stopTimer()

        if (!rpmEntry.pending) {
          return
        }

        this.timerUnavailableError =
          rpmEntry.pending === 'future' ? 'active-tomorrow' : 'active-6am'
      }
    } catch (error) {
      this.notifier.error(error)
      this.timerUnavailableError = 'no-tracking'
    } finally {
      this.loading = false
    }
  }

  private resolveCurrentRPMBillingCode(
    stateSummaryItem: CareManagementStateSummaryItem
  ): CodeAndTracking {
    const trackableCodes: TrackableBillableCode[] = Object.values(
      this.careManagementService.trackableCptCodes[this.serviceType]
    )
    let billingItem: CareManagementSnapshotBillingItem
    let trackableCode: TrackableBillableCode

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
        !foundCodeInEntry?.eligibility.next ||
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

      const response = await this.database.fetchCareManagementBillingSnapshot({
        account: account.id,
        organization: this.context.organizationId,
        serviceType: this.serviceType,
        limit: 1,
        offset: 0,
        status: 'all'
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
      case '98981':
      case '99439':
      case '99427':
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
      case '98975':
      case '98977':
      case '98980':
      case '99490':
      case '99426':
      case '99484':
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

  private async showUserIdleDialog(): Promise<void> {
    try {
      this.pauseTimer()
      await this.timeTracker.forceCommit(false)

      this.dialog
        .open(GestureClosingDialog, {
          data: {
            title: _('RPM.TIME_TRACKING_PAUSED'),
            content: _('RPM.USER_IDLE_DESCRIPTION')
          }
        })
        .afterClosed()
        .subscribe(() => {
          void this.resolveAccountCareSessionStatus(this.account)
          this.timeTracker.resetTrackingTimeStart()
        })
    } catch (error) {
      this.notifier.error(error)
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
    this.timerUnavailableError = 'no-tracking'
    this.seconds = 0
  }

  private timerHandler(): void {
    ++this.seconds

    void this.handleSecondPassing()

    this.cdr.detectChanges()
  }

  public onOpenSettings(): void {
    this.showStatusPanel = false
    this.openSettings.emit()
  }
}
