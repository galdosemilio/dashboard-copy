import { Component, OnInit, ViewChild } from '@angular/core'
import { MatSelect, MatSelectChange } from '@coachcare/material'
import { DieterDashboardSummary } from '@coachcare/sdk'
import { ContextService } from '@app/service'
import { _ } from '@app/shared'

@Component({
  selector: 'app-weight-dieter-summary-boxes',
  templateUrl: './weight-summary-boxes.component.html'
})
export class WeightDieterSummaryBoxesComponent implements OnInit {
  public activityLevels = [
    { value: -1, viewValue: _('SELECTOR.LEVEL.NONE') },
    { value: 0, viewValue: _('SELECTOR.LEVEL.SEDENTARY') },
    { value: 2, viewValue: _('SELECTOR.LEVEL.LOW') },
    { value: 4, viewValue: _('SELECTOR.LEVEL.MEDIUM') },
    { value: 7, viewValue: _('SELECTOR.LEVEL.HIGH') },
    { value: 10, viewValue: _('SELECTOR.LEVEL.INTENSE') }
  ]

  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018829432-Viewing-the-Patient-Dashboard'

  @ViewChild(MatSelect, { static: false })
  activitySelector: MatSelect

  constructor(
    public data: DieterDashboardSummary,
    private context: ContextService
  ) {}

  public async ngOnInit(): Promise<void> {
    // default level is low
    await this.data.init(this.context.accountId)
  }

  public setupActivityLevel(): void {
    if (this.data.haveBMRData) {
      this.activitySelector.open()
    }
  }

  public selectActivityLevel(event: MatSelectChange): void {
    this.data.update(event.value === -1 ? null : event.value)
  }
}
