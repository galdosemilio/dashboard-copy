import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CCRConfig } from '@app/config'
import { ContextService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { MetricsDatabase, MetricsDataSource } from '../../../services'
import { MetricsChartDataSource } from '../../../services/metrics/metrics.chart.datasource'

type MetricsComponentViewType = 'table' | 'chart'

@UntilDestroy()
@Component({
  selector: 'app-dieter-journal-metrics',
  templateUrl: './metrics.component.html'
})
export class MetricsComponent implements OnDestroy, OnInit {
  public chartSource: MetricsChartDataSource
  public initialDates: DateNavigatorOutput
  public section: string
  public source: MetricsDataSource
  public view: MetricsComponentViewType = 'table'

  constructor(
    private context: ContextService,
    private database: MetricsDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createSources()
    this.subscribeToSource()
  }

  public async toggleView(view: MetricsComponentViewType): Promise<void> {
    const params = {
      s: this.section,
      v: view
    }

    void this.router.navigate(['.', params], { relativeTo: this.route })
  }

  private createSources(): void {
    this.source = new MetricsDataSource(this.database)
    this.chartSource = new MetricsChartDataSource(
      this.database,
      this.context,
      this.translate,
      this.store
    )

    this.source.addDefault({
      account: this.context.accountId,
      organization: this.context.organizationId
    })

    this.source.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))

    this.chartSource.addDefault({
      account: this.context.accountId,
      organization: this.context.organizationId
    })

    this.chartSource.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
  }

  private subscribeToSource(): void {
    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((map) => {
      const section = map.get('s')
      this.section = section
      this.view = (map.get('v') || 'table') as MetricsComponentViewType
    })
  }
}
