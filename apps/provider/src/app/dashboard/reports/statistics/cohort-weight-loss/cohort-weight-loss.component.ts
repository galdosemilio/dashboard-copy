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
import Papa from 'papaparse'
import { Cohort } from '@coachcare/sdk'
import { resolveConfig } from '@app/config/section'
import { ActivatedRoute, Router } from '@angular/router'
import { PackageFilter } from '@app/shared/components/package-filter'
import { CSV } from '@coachcare/common/shared'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-cohort-weight-loss',
  templateUrl: './cohort-weight-loss.component.html',
  styleUrls: ['./cohort-weight-loss.component.scss']
})
export class CohortWeightLossComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = ['name']
  source: CohortWeightLossDataSource | null
  cohorts: Cohort[] = []

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()
  pkgFilter$ = new Subject<void>()

  private pkgFilter?: PackageFilter

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

    this.source.addOptional(this.pkgFilter$.pipe(debounceTime(300)), () => ({
      package: this.pkgFilter?.pkg[0]?.id
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

  async downloadCSV(): Promise<void> {
    try {
      const criteria = this.source.args
      criteria.limit = 'all'
      criteria.offset = 0
      const res = await this.database.fetchMeasurementCohortReport(criteria)

      if (!res.data.length) {
        throw new Error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }

      const filename = `Patient_Cohort_Weight_Loss_Report${
        this.pkgFilter
          ? '-Phase_' + CSV.sanitizeFileName(this.pkgFilter?.pkg[0].title)
          : ''
      }`

      const pref = this.context.user.measurementPreference
      let csv = 'Cohort Weight Loss\r\n'

      const data = res.data.map((d) => {
        const row = {
          ID: d.account.id,
          'First Name': d.account.firstName,
          'Last Name': d.account.lastName
        }

        this.cohorts.forEach((cohort, index) => {
          row[`${cohort.days} Days`] =
            unitConversion(
              pref,
              'composition',
              d.cohorts[index]?.change.value || 0,
              2
            ) +
            ' ' +
            this.source.i18n[
              unitLabel(
                pref,
                'composition',
                d.cohorts[index]?.change.value || 0
              )
            ]
        })

        row['Organization ID'] = d.organization.id
        row['Organization Name'] = d.organization.name

        return row
      })

      csv += Papa.unparse(data)

      CSV.toFile({
        filename,
        content: csv
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public onPackageFilter(filter: PackageFilter): void {
    this.pkgFilter = filter
    this.pkgFilter$.next()
  }
}
