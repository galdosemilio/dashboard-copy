import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { RouterState } from '@angular/router'
import { ReportsCriteria } from '@app/dashboard/reports/services'
import { ReportsState, UpdateControls } from '@app/dashboard/reports/store'
import { ContextService, EventsService } from '@app/service'
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
    private route: Store<RouterState>,
    private bus: EventsService
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
        if (!route.state.url.startsWith('/reports')) {
          return
        }

        switch (route.state.url) {
          case '/reports/overview/active':
            this._timeframe = 'last-12-months'
            this.startPeriod = {
              endDate: moment().format('YYYY-MM-DD'),
              startDate: moment()
                .subtract(12, 'months')
                .startOf('month')
                .format('YYYY-MM-DD')
            }
            break
          case '/reports/communications/communications':
            this._timeframe = 'this-month'
            this.startPeriod = {
              endDate: moment().endOf('month').format('YYYY-MM-DD'),
              startDate: moment().startOf('month').format('YYYY-MM-DD')
            }
            break
          case '/reports/rpm/billing':
            this._timeframe = 'day'
            break
          default:
            this._timeframe = 'week'
            if (this.range) {
              this.startPeriod = {
                startDate: moment()
                  .startOf('day')
                  .subtract(6, 'days')
                  .format('YYYY-MM-DD'),
                endDate: moment().endOf('day').format('YYYY-MM-DD')
              }
              delete this.fixedPeriod
            }
        }
      })

    this.bus.register('reports.controls', this.initControls.bind(this))

    this.cdr.detectChanges()
  }

  ngOnDestroy() {}

  initControls(criteria: ReportsCriteria) {
    if (isEmpty(criteria)) {
      return
    }

    this.startPeriod = {
      startDate: criteria.startDate,
      endDate: criteria.endDate
    }
    this._timeframe = criteria.timeframe
    this.updateSelector()
    this.cdr.detectChanges()
  }

  updateDates(dates: DateNavigatorOutput) {
    this._timeframe = dates.timeframe
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
        timeframe: this._timeframe,
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
