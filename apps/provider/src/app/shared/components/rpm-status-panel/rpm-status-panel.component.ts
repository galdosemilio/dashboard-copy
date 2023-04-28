import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { RPMStateSummaryEntry } from '@app/dashboard/reports/rpm/models'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import {
  CareManagementService,
  ContextService,
  NotifierService
} from '@app/service'
import { AccountAccessData, RPMStateSummaryBillingItem } from '@coachcare/sdk'
import * as moment from 'moment'

@Component({
  selector: 'app-rpm-status-panel',
  templateUrl: './rpm-status-panel.component.html',
  styleUrls: ['./rpm-status-panel.component.scss']
})
export class RPMStatusPanelComponent implements OnInit {
  @Input() serviceType: string
  @Input() trackingStartsTomorrow: boolean
  @Input() account: AccountAccessData
  @Output() openSettings: EventEmitter<void> = new EventEmitter<void>()

  public rpmStateSummary: RPMStateSummaryEntry
  public status: 'loading' | 'ready' = 'loading'

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private notifier: NotifierService,
    private careManagementService: CareManagementService
  ) {}

  public ngOnInit(): void {
    this.onRefresh()
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
}
