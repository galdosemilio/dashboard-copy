import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { MatSort } from '@coachcare/material'
import {
  CohortWeightLossDataSource,
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ContextService, NotifierService } from '@app/service'
import { _, unitConversion, unitLabel } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { Cohort } from '@coachcare/sdk'
import { resolveConfig } from '@app/config/section'
import { ActivatedRoute, Router } from '@angular/router'

@UntilDestroy()
@Component({
  selector: 'app-cohort-weight-loss',
  templateUrl: './cohort-weight-loss.component.html',
  styleUrls: ['./cohort-weight-loss.component.scss']
})
export class CohortWeightLossComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = ['name']
  source: CohortWeightLossDataSource | null
  cohorts: Cohort[] = []

  // subscription for selector changes
  data: ReportsCriteria
  csvSeparator = ','

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private notifier: NotifierService,
    private translator: TranslateService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.cohorts = resolveConfig(
      'COHORT_REPORTS.COHORTS',
      this.context.organization
    )
    this.columns.push(...this.cohorts.map((c) => `cohort${c.days}`))

    const showCohortWeightLossReport = resolveConfig(
      'COHORT_REPORTS.SHOW_COHORT_WEIGHT_LOSS_REPORT',
      this.context.organization
    )

    if (!showCohortWeightLossReport) {
      void this.router.navigate(['.'], { relativeTo: this.activeRoute.parent })
    }

    this.source = new CohortWeightLossDataSource(
      this.database,
      this.cohorts,
      this.translator,
      this.paginator
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data
        ? moment(this.data.startDate).format('YYYY-MM-DD')
        : null,
      endDate: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null
    }))

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })
  }

  ngAfterViewInit() {
    if (!this.source.isLoaded) {
      this.refresh$.next()
      this.cdr.detectChanges()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  downloadCSV() {
    const criteria = this.source.args
    criteria.limit = 'all'
    criteria.offset = 0
    void this.database.fetchMeasurementCohortReport(criteria).then((res) => {
      if (!res.data.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const filename = `Patient_Cohort_Weight_Loss_Report.csv`
      let csv = ''
      csv += 'Cohort Weight Loss\r\n'
      csv +=
        '"ID"' +
        this.csvSeparator +
        '"First Name"' +
        this.csvSeparator +
        '"Last Name"' +
        this.csvSeparator +
        this.cohorts.reduce((prev, current) => {
          return prev + `"${current.days} Days"` + this.csvSeparator
        }, '') +
        '"Organization ID"' +
        this.csvSeparator +
        '"Organization Name"' +
        '\r\n'

      const pref = this.context.user.measurementPreference
      res.data.forEach((d) => {
        csv +=
          `"${d.account.id}"` +
          this.csvSeparator +
          `"${d.account.firstName}"` +
          this.csvSeparator +
          `"${d.account.lastName}"` +
          this.csvSeparator +
          this.cohorts.reduce((prev, current, curIndex) => {
            return (
              prev +
              unitConversion(
                pref,
                'composition',
                d.cohorts[curIndex]?.change.value || 0,
                2
              ) +
              ' ' +
              this.source.i18n[
                unitLabel(
                  pref,
                  'composition',
                  d.cohorts[curIndex]?.change.value || 0
                )
              ] +
              this.csvSeparator
            )
          }, '') +
          `"${d.organization.id}"` +
          this.csvSeparator +
          `"${d.organization.name}"` +
          '\r\n'
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}
