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
  StatisticsDatabase,
  WeightChangeDataSource
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ContextService, NotifierService } from '@app/service'
import { _, CcrPaginator, unitConversion, unitLabel } from '@app/shared'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-statistics-weight-change-table',
  templateUrl: './weight-change.component.html',
  styleUrls: ['./weight-change.component.scss']
})
export class WeightChangeTableComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = ['name', 'startWeight', 'endWeight', 'change', 'value']
  source: WeightChangeDataSource | null

  // subscription for selector changes
  data: ReportsCriteria
  csvSeparator = ','

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new WeightChangeDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.paginator,
      this.sort
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
    this.database.fetchWeightChange(criteria).then((res) => {
      if (!res.data.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const format = 'YYYY-MM-DD'
      const orgName = res.data[0].organization.name
      const filename = `Patient_Weight_Change_${criteria.startDate}_${criteria.endDate}.csv`
      let csv = ''
      csv += 'WEIGHT CHANGE REPORT\r\n'
      csv +=
        'ID' +
        this.csvSeparator +
        'First Name' +
        this.csvSeparator +
        'Last Name' +
        this.csvSeparator +
        'Start Weight' +
        this.csvSeparator +
        'End Weight' +
        this.csvSeparator +
        'Change Value' +
        this.csvSeparator +
        'Change Percentage' +
        this.csvSeparator +
        'Organization ID' +
        this.csvSeparator +
        'Organization' +
        '\r\n'

      const pref = this.context.user.measurementPreference
      res.data.forEach((d) => {
        csv +=
          d.account.id +
          this.csvSeparator +
          d.account.firstName +
          this.csvSeparator +
          d.account.lastName +
          this.csvSeparator +
          unitConversion(pref, 'composition', d.change.startWeight, 2) +
          ' ' +
          this.source.i18n[
            unitLabel(pref, 'composition', d.change.startWeight)
          ] +
          this.csvSeparator +
          unitConversion(pref, 'composition', d.change.endWeight, 2) +
          ' ' +
          this.source.i18n[unitLabel(pref, 'composition', d.change.endWeight)] +
          this.csvSeparator +
          unitConversion(pref, 'composition', d.change.value, 2) +
          ' ' +
          this.source.i18n[unitLabel(pref, 'composition', d.change.value)] +
          this.csvSeparator +
          d.change.percentage +
          ' %' +
          this.csvSeparator +
          d.organization.id +
          this.csvSeparator +
          d.organization.name +
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
