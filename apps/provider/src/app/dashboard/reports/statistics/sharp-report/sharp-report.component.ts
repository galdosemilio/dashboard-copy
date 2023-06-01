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
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ContextService, NotifierService } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { select, Store } from '@ngrx/store'
import { _ } from '@app/shared'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { resolveConfig } from '@app/config/section'
import { ActivatedRoute, Router } from '@angular/router'
import { PackageFilter } from '@app/shared/components/package-filter'
import { CSV } from '@coachcare/common/shared'
import { debounceTime } from 'rxjs/operators'
import {
  MEAL_REPLACEMENT_ID,
  SharpReportDataSource,
  VEGETABLES_FRUITS_ID
} from '../../services/sharp-report.datasource'

@UntilDestroy()
@Component({
  selector: 'app-sharp-report',
  templateUrl: './sharp-report.component.html'
})
export class SharpReportComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = [
    'id',
    'firstName',
    'lastName',
    'dateOfBirth',
    'kcalTotalSum',
    'exerciseMinutesTotalSum',
    'mealReplacementTotalSum',
    'vegetablesFruitsTotalSum'
  ]
  source: SharpReportDataSource | null

  // subscription for selector changes
  data: ReportsCriteria
  csvSeparator = ','

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
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    const showSharpReport = resolveConfig(
      'CUSTOM_REPORTS.SHARP_CUSTOM_REPORT',
      this.context.organization
    )

    if (!showSharpReport) {
      void this.router.navigate(['.'], { relativeTo: this.activeRoute.parent })
    }

    this.source = new SharpReportDataSource(this.database, this.paginator)

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      range: {
        start: this.data
          ? moment(this.data.startDate).format('YYYY-MM-DD')
          : null,
        end: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null
      }
    }))

    this.source.addOptional(this.pkgFilter$.pipe(debounceTime(300)), () => ({
      packages: this.pkgFilter?.pkg?.map((entry) => entry.id)
    }))

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((criteria: ReportsCriteria) => {
        if (!isEmpty(criteria)) {
          this.data = criteria
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

  async downloadCSVReport(): Promise<void> {
    try {
      const criteria = this.source.args
      criteria.limit = 'all'
      criteria.offset = 0
      const res = await this.database.fetchSharpReport(criteria)
      if (!res.data.length) {
        throw new Error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const filename = `Patient_Sharp_Custom_Report${
        this.pkgFilter
          ? '-Phase_' + CSV.sanitizeFileName(this.pkgFilter?.pkg[0].title)
          : ''
      }`
      let csv = ''
      csv += 'Sharp Custom Report\r\n'
      csv +=
        '"ID"' +
        this.csvSeparator +
        '"First Name"' +
        this.csvSeparator +
        '"Last Name"' +
        this.csvSeparator +
        '"DOB"' +
        this.csvSeparator +
        '"KCAL"' +
        this.csvSeparator +
        '"EXERCISE MINUTES"' +
        this.csvSeparator +
        '"MEAL REPLACEMENT"' +
        this.csvSeparator +
        '"VEGETABLES & FRUITS"' +
        '\r\n'
      res.data
        .map((item) => {
          return {
            ...item,
            kcalTotalSum: this.source.getAggregatesValue(
              item.aggregates.find((aggregate) => aggregate.key == 'kcal')
            ),
            exerciseMinutesTotalSum: this.source.getAggregatesValue(
              item.aggregates.find(
                (aggregate) => aggregate.key == 'exercise-minutes'
              )
            ),
            mealReplacementTotalSum: this.source.getAggregatesValue(
              item.aggregates.find(
                (aggregate) =>
                  typeof aggregate.key == 'object' &&
                  aggregate.key.type.id == MEAL_REPLACEMENT_ID
              )
            ),
            vegetablesFruitsTotalSum: this.source.getAggregatesValue(
              item.aggregates.find(
                (aggregate) =>
                  typeof aggregate.key == 'object' &&
                  aggregate.key.type.id == VEGETABLES_FRUITS_ID
              )
            )
          }
        })
        .forEach((d) => {
          csv +=
            `"${d.id}"` +
            this.csvSeparator +
            `"${d.firstName}"` +
            this.csvSeparator +
            `"${d.lastName}"` +
            this.csvSeparator +
            `"${d.dateOfBirth}"` +
            this.csvSeparator +
            `"${d.kcalTotalSum}"` +
            this.csvSeparator +
            `"${d.exerciseMinutesTotalSum}"` +
            this.csvSeparator +
            `"${d.mealReplacementTotalSum}"` +
            this.csvSeparator +
            `"${d.vegetablesFruitsTotalSum}"` +
            '\r\n'
        })
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
