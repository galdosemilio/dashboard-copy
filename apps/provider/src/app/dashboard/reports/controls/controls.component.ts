import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { RouterState } from '@angular/router'
import { ReportsCriteria } from '@app/dashboard/reports/services'
import {
  ReportsState,
  UpdateControls,
  criteriaSelector
} from '@app/dashboard/reports/store'
import { ContextService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { FixedPeriod } from '@app/shared/components/date-range/date-range.component'
import { routerSelector } from '@app/store/router'
import { select, Store } from '@ngrx/store'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { isEmpty } from 'lodash'

interface StartPeriod {
  endDate?: string
  startDate?: string
}

@UntilDestroy()
@Component({
  selector: 'app-report-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ReportsControlsComponent implements OnInit, OnDestroy {
  @Input()
  allowNavigation = true
  @Input()
  dayDateFormat = ''
  @Input()
  discrete = false
  @Input()
  range = true

  @Input() set timeframe(value: string) {
    this._timeframe = value || 'week'
  }

  get timeframe() {
    return this._timeframe
  }

  _timeframe = 'week'
  clinic: string
  fixedPeriod: FixedPeriod
  startPeriod: StartPeriod = {}
  startView: 'week' | 'month' | 'year' | 'years' = 'month'
  minDate: string

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private reports: Store<ReportsState>,
    private route: Store<RouterState>
  ) {}

  ngOnInit() {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      if (org && org.id && org.id !== this.clinic) {
        this.minDate = org.createdAt
        this.selectClinic(org.id)
      }
    })

    this.route
      .pipe(untilDestroyed(this), select(routerSelector))
      .subscribe((route) => {
        switch (route.state.url) {
          case '/reports/overview/active':
            this.startView = 'year'
            this.startPeriod = {
              endDate: moment().format(),
              startDate: moment()
                .subtract(12, 'months')
                .startOf('month')
                .format()
            }
            break
          case '/reports/communications/communications':
            this.startView = 'month'
            this.startPeriod = {
              endDate: moment().startOf('month').format(),
              startDate: moment().endOf('month').format()
            }
            break
          default:
            this.startView = 'week'
            delete this.fixedPeriod
        }
      })

    this.reports
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((criteria: ReportsCriteria) => {
        if (!isEmpty(criteria)) {
          this.startPeriod = {
            startDate: criteria.startDate,
            endDate: criteria.endDate
          }
          this._timeframe = criteria.timeframe
          this.cdr.detectChanges()
        }
      })

    this.cdr.detectChanges()
  }

  ngOnDestroy() {}

  updateDates(dates: DateNavigatorOutput) {
    this.timeframe = dates.timeframe
    this.startPeriod = {
      startDate: dates.startDate,
      endDate: dates.endDate
    }
    this.updateSelector()
  }

  selectClinic(value) {
    this.clinic = value
    this.updateSelector()
  }

  updateSelector() {
    if (this.clinic && this.startPeriod.endDate) {
      const criteria: ReportsCriteria = {
        organization: this.clinic,
        startDate: this.startPeriod.startDate,
        endDate: this.startPeriod.endDate,
        timeframe: this.timeframe,
        diff:
          moment(this.startPeriod.endDate).diff(
            this.startPeriod.startDate,
            'days'
          ) + 1
      }
      this.reports.dispatch(new UpdateControls({ criteria }))
    }
  }
}
