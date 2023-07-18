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
import * as moment from 'moment'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import {
  CareManagementService,
  ContextService,
  GestureService,
  NotifierService,
  TimeTrackerService
} from '@app/service'
import { AccountAccessData, CareManagementState } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, filter } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { GestureClosingDialog } from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import { Subject, combineLatest, merge } from 'rxjs'
import { RPMStateEntry } from '../rpm/models'
import { CareManagementStateSummaryItem } from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'
import {
  RPMStateSummaryBilling,
  RPMStateSummaryEntry
} from '@app/dashboard/reports/rpm/models'

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
      !this.statusPanel.nativeElement.contains($event.target) &&
      !$event.target.matches('mat-option') &&
      !$event.target.matches('.mat-option-text') &&
      !$event.target.matches('.cdk-overlay-backdrop')
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
  public automatedTimeTracking = true
  public account: AccountAccessData
  public currentBillingItem: RPMStateSummaryBilling
  public currentCodeString: string
  public showStatusPanel = false
  public showTimer = false
  public timerDisplay = '00:00'
  public timeTrackingComplete = false
  public timerUnavailableError?: TimerUnavailableError = 'no-tracking'
  public loading = false

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

  private requiredIterationSeconds = 0
  private _seconds = 0
  private timerInterval

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private dialog: MatDialog,
    private gesture: GestureService,
    private notifier: NotifierService,
    private careManagementState: CareManagementState,
    private careManagementService: CareManagementService,
    private timeTracker: TimeTrackerService
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

    this.context.automatedTimeTracking$
      .pipe(untilDestroyed(this))
      .subscribe((automatedTimeTracking) => {
        this.automatedTimeTracking = automatedTimeTracking
      })

    this.serviceType$
      .pipe(debounceTime(100))
      .subscribe(() => this.resolveAccountCareSessionStatus(this.account))

    combineLatest([this.gesture.userIdle$, this.context.automatedTimeTracking$])
      .pipe(
        untilDestroyed(this),
        filter(
          ([idle, automatedTimeTracking]) => automatedTimeTracking && !!idle
        )
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
      if (
        this.seconds < this.requiredIterationSeconds ||
        this.requiredIterationSeconds === 0
      ) {
        return
      }

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
      if (!account || !this.serviceType || !this.automatedTimeTracking) {
        return
      }
      this.loading = true
      this.timeTrackingComplete = false
      this.currentCodeString = ''
      this.requiredIterationSeconds = 0
      this.timerUnavailableError = undefined
      this.stopTimer()

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
  ): RPMStateSummaryBilling {
    const allBillings = this.careManagementService.billingCodes
      .filter((billingCode) => billingCode.serviceType.id === this.serviceType)
      .map((billingCode) => ({
        code: billingCode.value,
        eligibility: {}
      }))
    const rpmStateSummary = new RPMStateSummaryEntry(
      stateSummaryItem,
      allBillings,
      this.careManagementService.trackableCptCodes[this.serviceType],
      moment().toISOString()
    )

    const trackableBillings = rpmStateSummary.billing.filter(
      (entry) => entry.trackableCode
    )

    return (
      trackableBillings.find((billingEntry) => {
        const requiredSeconds =
          billingEntry.eligibility.next?.monitoring?.total?.seconds?.required
        const trackedSeconds =
          billingEntry.eligibility.next?.monitoring?.total?.seconds?.tracked

        return (
          billingEntry?.eligibility.next && trackedSeconds < requiredSeconds
        )
      }) || trackableBillings[trackableBillings.length - 1]
    )
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
      this.currentBillingItem = this.resolveCurrentRPMBillingCode(
        rpmBillingReportEntry
      )

      if (!this.currentBillingItem) {
        this.cdr.detectChanges()
        return
      }

      this.requiredIterationSeconds =
        this.currentBillingItem?.eligibility?.next?.monitoring?.total?.seconds?.required
      this.currentCodeString = this.currentBillingItem.code

      if (this.currentBillingItem.trackableCode.requiresTimeTracking) {
        this.resolveTimerStartTime()

        this.showTimer = true
        this.cdr.detectChanges()

        if (
          this.seconds < this.requiredIterationSeconds ||
          this.requiredIterationSeconds === 0
        ) {
          this.startTimer()
        } else {
          this.timeTrackingComplete = true
          this.seconds = 0
          this.requiredIterationSeconds = 0
        }
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private resolveTimerStartTime(): void {
    if (!this.currentBillingItem?.trackableCode) {
      this.seconds = 0

      return
    }

    this.seconds =
      this.currentBillingItem.eligibility.next?.monitoring?.total?.seconds?.tracked
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

  public onCloseStatusPanel(): void {
    this.showStatusPanel = false
  }

  public onOpenSettings(): void {
    this.showStatusPanel = false
    this.openSettings.emit()
  }
}
