import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms'
import { RPMStateSummaryEntry } from '@app/dashboard/reports/rpm/models'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import {
  CareManagementService,
  ContextService,
  NotifierService,
  TimeTrackerService
} from '@app/service'
import { AccountAccessData, RPMStateSummaryBillingItem } from '@coachcare/sdk'
import * as moment from 'moment'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-rpm-status-panel',
  templateUrl: './rpm-status-panel.component.html',
  styleUrls: ['./rpm-status-panel.component.scss']
})
export class RPMStatusPanelComponent implements OnInit {
  @Input()
  set serviceType(_serviceType: string) {
    this._serviceType = _serviceType
    this.serviceType$.next(_serviceType)
  }

  get serviceType(): string {
    return this._serviceType
  }
  @Input() trackingStartsTomorrow: boolean
  @Input() account: AccountAccessData
  @Output() openSettings: EventEmitter<void> = new EventEmitter<void>()
  @Output() closePanel: EventEmitter<void> = new EventEmitter<void>()

  public rpmStateSummary: RPMStateSummaryEntry
  public status: 'loading' | 'ready' = 'loading'
  public minutes = Array.from({ length: 60 }, (_, i) => i)
  public seconds = Array.from({ length: 12 }, (_, i) => i * 5)
  public showManualTime = false
  public automatedTimeTracking = true
  public addTimeForm = this.formBuilder.group(
    {
      minutes: [0],
      seconds: [0]
    },
    {
      validators: this.validateMinutesAndSeconds()
    }
  )
  public get serviceTypeLabel(): string {
    return this.serviceType
      ? this.context.user.careManagementServiceTypes.find(
          (type) => type.id === this.serviceType
        )?.name
      : ''
  }
  private _serviceType: string
  private serviceType$ = new Subject<string>()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private notifier: NotifierService,
    private careManagementService: CareManagementService,
    private timeTracker: TimeTrackerService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.onRefresh()
    this.serviceType$.subscribe(() => {
      this.onRefresh()
    })
    this.context.automatedTimeTracking$.subscribe((value) => {
      this.automatedTimeTracking = value
    })
  }

  public onRefresh(): void {
    void this.fetchRPMBillingStatus()
  }

  public getStatus(): 'active' | 'begins-tomorrow' | 'inactive' {
    if (this.rpmStateSummary && !this.trackingStartsTomorrow) {
      return 'active'
    } else if (!this.rpmStateSummary && this.trackingStartsTomorrow) {
      return 'begins-tomorrow'
    } else {
      return 'inactive'
    }
  }

  public async addManualTime(): Promise<void> {
    const seconds = moment.duration({
      minutes: Number(this.addTimeForm.value.minutes),
      seconds: Number(this.addTimeForm.value.seconds)
    })

    const now = moment()
    const endTime = now.toDate()
    const startTime = moment(now).subtract(seconds).toDate()

    try {
      await this.timeTracker.manualCommit(startTime, endTime)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.closePanel.emit()
    }
  }

  public toggleManualTime(): void {
    this.addTimeForm.reset({
      minutes: 0,
      seconds: 0
    })
    this.showManualTime = !this.showManualTime
  }

  private async fetchRPMBillingStatus(): Promise<void> {
    if (this.trackingStartsTomorrow || !this.serviceType) {
      this.status = 'ready'
      return
    }

    try {
      this.status = 'loading'

      const response = await this.database.fetchCareManagementBillingSnapshot({
        account: this.account.id,
        organization: this.context.organizationId,
        serviceType: this.serviceType,
        limit: 1,
        offset: 0,
        status: 'all'
      })

      if (response.data.length) {
        const allBillings = this.careManagementService.billingCodes
          .filter(
            (billingCode) => billingCode.serviceType.id === this.serviceType
          )
          .map((billingCode) => ({
            code: billingCode.value,
            eligibility: {}
          }))
        this.rpmStateSummary = new RPMStateSummaryEntry(
          response.data[0],
          allBillings,
          this.careManagementService.trackableCptCodes[this.serviceType],
          moment().toISOString()
        )
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.status = 'ready'
      this.cdr.detectChanges()
    }
  }

  public onOpenSettings() {
    this.openSettings.emit()
  }

  public isMetDepsRequirement(
    entry: RPMStateSummaryBillingItem['eligibility'],
    code: string
  ) {
    if (!entry.next?.relatedCodeRequirementsNotMet) {
      return
    }

    return !entry.next.relatedCodeRequirementsNotMet.includes(code)
  }

  private validateMinutesAndSeconds(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const minutes = control.get('minutes').value
      const seconds = control.get('seconds').value
      const invalid = minutes === 0 && seconds === 0
      return invalid ? { invalid: true } : null
    }
  }
}
