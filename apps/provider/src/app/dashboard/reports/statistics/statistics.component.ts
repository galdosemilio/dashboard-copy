import { Component, OnInit } from '@angular/core'
import { ContextService, EventsService } from '@app/service'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { resolveConfig } from '@app/config/section'

@UntilDestroy()
@Component({
  selector: 'app-reports-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  showReportControls = true
  showCohortWeightLossReport = false
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020083952-Viewing-the-Reports-Statistics'

  constructor(
    private bus: EventsService,
    private router: Router,
    private context: ContextService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe((event: NavigationEnd) => {
        this.showReportControls = !event.url.split('/').pop().includes('cohort')
      })
  }

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.showCohortWeightLossReport = resolveConfig(
        'COHORT_REPORTS.SHOW_COHORT_WEIGHT_LOSS_REPORT',
        org
      )
    })
  }
}
