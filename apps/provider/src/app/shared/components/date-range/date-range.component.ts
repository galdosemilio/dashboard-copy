import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { MatDatepicker } from '@coachcare/datepicker'
import { unitOfTime } from 'moment'
import * as moment from 'moment-timezone'

export interface DateRangeNavigatorOutput {
  timeframe?: string
  startDate?: string
  endDate?: string
}

export interface FixedPeriod {
  endDate?: string
  startDate?: string
}

type CalendarView = 'week' | 'month' | 'year' | 'years'

@Component({
  selector: 'date-range-navigator',
  templateUrl: 'date-range.component.html'
})
export class DateRangeNavigator implements AfterViewInit, OnChanges {
  @HostBinding('class.hidden') hidden = false

  @ViewChild('pickerEnd', { static: false }) pickerEnd: MatDatepicker<any>
  @ViewChild('pickerStart', { static: false }) pickerStart: MatDatepicker<any>

  @Input()
  set start(date: undefined | string | moment.Moment) {
    if (date) {
      this._start = moment(date)
    }
  }
  @Input()
  set end(date: undefined | string | moment.Moment) {
    if (date) {
      this._end = moment(date)
      this._maxReached = this._end.isSameOrAfter(this._limit)
    }
  }
  @Input()
  set maxDiff(diff: moment.Duration) {
    this._maxDiff = diff
  }
  @Input()
  set max(max: boolean | string | moment.Moment) {
    this._limit =
      max === true ? moment() : max ? moment(max) : moment('2500-01-01')
  }

  @Input() min?: string

  @Input() fixedPeriod: FixedPeriod

  @Input() endView: CalendarView = 'month'

  @Input() set timeframe(value: string) {
    switch (value) {
      case 'month':
        this._timeframe = 'this-month'
        this._startView = 'month'
        break
      case 'week':
        this._timeframe = 'week'
        this._startView = 'week'
        break
      case 'year':
        this._timeframe = 'last-12-months'
        this._startView = 'year'
        break
      case 'years':
        this._timeframe = 'all-time'
        this._startView = 'years'
        break
      default:
        this._timeframe = value
        this._startView = 'month'
    }
  }

  get timeframe() {
    return this._timeframe
  }

  get startView() {
    return this._startView
  }

  @Output() selectedDate = new EventEmitter<DateRangeNavigatorOutput>()

  public _start = moment().startOf('day').subtract(1, 'week').add(1, 'day')
  public _end = moment()
  private _timeframe: string

  public _maxDiff = moment.duration(1, 'year')
  public _limit = moment()
  public _min = moment().subtract(this._maxDiff)
  public _maxReached = false
  public _dateFormat: string

  private _startView: CalendarView = 'month'

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.processAndEmit()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.maxDiff) {
      this._min = moment(this._end).subtract(this._maxDiff)
      this.validateMaxDiff()
    }

    let doUpdate =
      !changes.start ||
      changes.start.firstChange ||
      changes.start.currentValue !== this._start.format('YYYY-MM-DD')

    doUpdate =
      doUpdate ||
      !changes.end ||
      changes.end.firstChange ||
      changes.end.currentValue !== this._end.format('YYYY-MM-DD')

    if (doUpdate) {
      this.processAndEmit()
    }
  }

  get interval(): [number, unitOfTime.DurationConstructor] {
    if (this.timeframe.includes('week') || this.timeframe === 'last-7-days') {
      return [7, 'days']
    } else if (this.timeframe === 'last-three-months') {
      return [3, 'months']
    } else if (
      this.timeframe === 'last-12-months' ||
      this.timeframe === 'this-year'
    ) {
      return [12, 'months']
    } else {
      return [1, 'month']
    }
  }

  onQuickSelect(dateRange): void {
    this._start = moment(dateRange.start)
    this._end = moment(dateRange.end)
    this._timeframe = dateRange.timeframe
    this.processAndEmit()
  }

  pickStart(date: moment.Moment) {
    if (!moment(date).isSame(this._start, 'days')) {
      this._start = moment(date)
      this.processAndEmit()
    }
  }

  pickEnd(date: moment.Moment) {
    if (!moment(date).isSame(this._end, 'days')) {
      this._end = moment(date)
      this.processAndEmit()
    }
  }

  changeDate(next: boolean): void {
    if ((next && this._maxReached) || this.timeframe === 'all-time') {
      return
    }

    const [count, timeUnit] = this.interval

    if (next) {
      this._start.add(count, timeUnit).startOf(timeUnit)
      this._end.add(count, timeUnit).endOf(timeUnit)
    } else {
      this._start.subtract(count, timeUnit).startOf(timeUnit)
      this._end.subtract(count, timeUnit).endOf(timeUnit)
    }

    this.processAndEmit()
  }

  onSelectMonth(input: 'start' | 'end', $event: moment.Moment): void {
    if (this.endView !== 'year') {
      return
    }

    if (input === 'start') {
      this.pickerStart.close()
      this.pickStart($event.startOf('month'))
    } else {
      this.pickerEnd.close()
      this.pickEnd(
        $event.endOf('month').isAfter(moment(), 'day')
          ? moment()
          : $event.endOf('month')
      )
    }
  }

  onSelectYear(input: 'start' | 'end', $event: moment.Moment): void {
    if (this.endView !== 'years') {
      return
    }

    if (input === 'start') {
      this.pickerStart.close()
      this.pickStart($event.startOf('year'))
    } else {
      this.pickerEnd.close()
      this.pickEnd($event.startOf('year'))
    }
  }

  private validateMaxDiff(): void {
    const maxDiff = this._maxDiff.asDays()
    if (maxDiff === 365) {
      // no more than 12 months
      this._min = moment(this.end).subtract(11, 'months').startOf('month')
    }
    if (moment(this._end).diff(this._start, 'days') > maxDiff) {
      // constrain applied to _start
      this._start = moment(this.end)
      if (maxDiff === 365) {
        // only graph 12 blocks
        this._start = moment(this._min)
      } else {
        this._start.subtract(maxDiff)
      }
    }
  }

  private processAndEmit(): void {
    this._start =
      this.fixedPeriod && this.fixedPeriod.startDate
        ? moment(this.fixedPeriod.startDate)
        : this._start
    this._end =
      this.fixedPeriod && this.fixedPeriod.endDate
        ? moment(this.fixedPeriod.endDate)
        : this._end

    this.hidden = false

    const diff = this.interval

    const next = moment(this._end).add(diff[0], diff[1])
    const major = moment.max(next, this._limit).format('YYYY-MM-DD')
    this._maxReached = major !== this._limit.format('YYYY-MM-DD')

    switch (true) {
      case diff[0] > 365 * 5:
        // ~60 bars
        this._dateFormat = 'YYYY'
        break
      case diff[0] > 61:
        // +-62 bars
        this._dateFormat = 'D MMM YYYY'
        break
      default:
        // < 62 bars
        this._dateFormat = 'D MMM YYYY'
    }

    this.cdr.detectChanges()

    this.selectedDate.emit({
      timeframe: this._timeframe,
      startDate: this._start.format('YYYY-MM-DD'),
      endDate: this._end.format('YYYY-MM-DD')
    })
  }
}
