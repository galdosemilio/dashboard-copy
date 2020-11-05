import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core'
import {
  RPM_CODE_COLUMNS,
  RPMStateSummaryEntry
} from '@app/dashboard/reports/rpm/models'
import { ReportsDatabase } from '@app/dashboard/reports/services/reports.database'
import { ContextService, NotifierService } from '@app/service'
import { AccountAccessData } from '@coachcare/npm-api'
import * as moment from 'moment'

@Component({
  selector: 'app-rpm-status-panel',
  templateUrl: './rpm-status-panel.component.html',
  styleUrls: ['./rpm-status-panel.component.scss']
})
export class RPMStatusPanelComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  checkClick($event: any): void {
    if (
      this.status === 'ready' &&
      !this.elementRef.nativeElement.contains($event.target)
    ) {
      this.forceClose.next()
    }
  }

  @Input() account: AccountAccessData
  @Output() forceClose: EventEmitter<void> = new EventEmitter<void>()

  public rpmStateSummary: RPMStateSummaryEntry
  public status: 'loading' | 'ready' = 'loading'

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private elementRef: ElementRef,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.onRefresh()
  }

  public onRefresh(): void {
    this.fetchRPMBillingStatus()
  }

  private async fetchRPMBillingStatus(): Promise<void> {
    try {
      this.status = 'loading'
      const response = await this.database.fetchRPMBillingReport({
        account: this.account.id,
        organization: this.context.organizationId,
        limit: 1,
        offset: 0
      })

      if (!response.data.length) {
        return
      }

      const allBillings = Object.keys(RPM_CODE_COLUMNS).map(
        (key) =>
          ({
            code: key,
            eligibility: {}
          } as any)
      )

      this.rpmStateSummary = new RPMStateSummaryEntry(
        response.data[0],
        allBillings,
        moment().toISOString()
      )

      this.status = 'ready'

      this.cdr.detectChanges()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
