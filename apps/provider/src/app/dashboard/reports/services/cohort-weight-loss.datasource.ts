import { CcrPaginatorComponent } from '@coachcare/common/components'
import { TableDataSource } from '@app/shared/model'
import {
  Cohort,
  MeasurementCohortReportRequest,
  MeasurementCohortReportResponse,
  MeasurementCohortSegment
} from '@coachcare/sdk'
import { TranslationsObject, _ } from '@app/shared/utils'
import { from, Observable } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { StatisticsDatabase } from './statistics.database'

@UntilDestroy()
export class CohortWeightLossDataSource extends TableDataSource<
  MeasurementCohortSegment,
  MeasurementCohortReportResponse,
  MeasurementCohortReportRequest
> {
  i18n: TranslationsObject
  unit: string

  constructor(
    protected database: StatisticsDatabase,
    private cohorts: Cohort[],
    private translator: TranslateService,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    this.pageSize = 25
    this.addDefault({
      type: 1,
      cohorts: this.cohorts
    })
    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }

    this.buildFormatter()
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.buildFormatter()
      })
  }

  private buildFormatter() {
    // TODO use the conversion pipes inside this class
    this.translator
      .get([_('UNIT.KG'), _('UNIT.LB'), _('UNIT.LBS')])
      .subscribe((translations) => {
        this.i18n = translations
        // setup the label formatters
        this.unit = translations['UNIT.LBS']
      })
  }

  defaultFetch(): MeasurementCohortReportResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: MeasurementCohortReportRequest
  ): Observable<MeasurementCohortReportResponse> {
    return from(this.database.fetchMeasurementCohortReport(criteria))
  }

  mapResult(
    result: MeasurementCohortReportResponse
  ): Array<MeasurementCohortSegment> {
    // pagination handling
    this.total = this.getTotal(result)

    return result.data
  }
}
