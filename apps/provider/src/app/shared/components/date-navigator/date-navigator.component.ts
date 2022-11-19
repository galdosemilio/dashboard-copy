import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { unitOfTime } from 'moment'
import * as moment from 'moment-timezone'

export interface DateNavigatorOutput {
  current?: string
  endDate?: string
  startDate?: string
  timeframe?: string
}

@Component({
  selector: 'date-navigator',
  templateUrl: 'date-navigator.component.html'
})
export class DateNavigator implements OnChanges {
  @HostBinding('class.hidden') hidden = false

  @Input() allowNavigation = true
  @Input() dayDateFormat = ''
  @Input() direction: 'forward' | 'backward' = 'backward'
  @Input() discrete = false
  @Input() showTimeframeSelector = false
  @Input() timeframe: unitOfTime.DurationConstructor = 'day'

  get _timeframe() {
    switch (this.timeframe.toString()) {
      case 'alltime':
        return {
          duration: 1,
          unit: 'year' as unitOfTime.DurationConstructor
        }

      case 'sixMonths':
        return {
          duration: 6,
          unit: 'month' as unitOfTime.DurationConstructor
        }

      case 'threeMonths':
        return {
          duration: 3,
          unit: 'month' as unitOfTime.DurationConstructor
        }

      default:
        return {
          duration: 1,
          unit: this.timeframe
        }
    }
  }

  @Input()
  set date(date: string) {
    this._current = moment(date)
    this._start =
      this.direction === 'backward'
        ? moment(this._current).subtract(
            this._timeframe.duration,
            this._timeframe.unit
          )
        : moment(this._current)
            .startOf(this._timeframe.unit)
            .add(this._timeframe.duration, this._timeframe.unit)
            .subtract(1, 'day')
            .endOf('day')
  }
  @Input()
  set max(max: boolean | string) {
    this._limit =
      max === true ? moment() : max ? moment(max) : moment('2500-01-01')

    if (this._current.isSameOrBefore(this._limit, this._timeframe.unit)) {
      return
    }

    this.pickerDate(moment().toDate())
  }

  @Output() selectedDate = new EventEmitter<DateNavigatorOutput>()

  public _current = moment()
  public _start = moment()
  public _limit = moment()
  public _range: string
  public _maxReached = true

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !changes.date ||
      changes.date.firstChange ||
      changes.date.currentValue !== this._current.format('YYYY-MM-DD')
    ) {
      this.processAndEmit()
    }
  }

  pickerDate(date: Date) {
    const ini = moment(date)
    // emit only if the interval will be different
    if (ini.format() !== this._start.format()) {
      this._current = ini
      this._start = moment(this._current)
      this.processAndEmit()
    }
  }

  changeDate(next: boolean): void {
    if (next && this._maxReached) {
      return
    }

    next
      ? this._current.add(this._timeframe.duration, this._timeframe.unit)
      : this._current.subtract(this._timeframe.duration, this._timeframe.unit)

    this.processAndEmit()
  }

  hasTimeframeSelector() {
    return this.showTimeframeSelector
  }

  updateTimeframe(timeframe: unitOfTime.DurationConstructor) {
    this.timeframe = timeframe
    this.processAndEmit()
  }

  private processAndEmit(): void {
    if (this.timeframe.toString() === 'alltime') {
      this.hidden = true
      this.selectedDate.emit({
        timeframe: this.timeframe,
        current: this._current.format('YYYY-MM-DD'),
        startDate: '2010-01-01',
        endDate: moment().format('YYYY-MM-DD')
      })
      return
    }
    this.hidden = false

    this._start =
      this.direction === 'backward'
        ? moment(this._current)
            .subtract(this._timeframe.duration, this._timeframe.unit)
            .add(1, 'days')
        : moment(this._current).startOf(this._timeframe.unit)
    const end =
      this.direction === 'backward'
        ? this.discrete
          ? moment(this._current).endOf(this._timeframe.unit)
          : moment(this._current)
        : this.discrete
        ? moment(this._current).endOf(this._timeframe.unit)
        : moment(this._current).endOf(this._timeframe.unit)

    this._start = this.discrete
      ? moment(end).startOf(this._timeframe.unit)
      : this._start

    switch (this._timeframe.unit) {
      case 'day':
        this._range = this.dayDateFormat
          ? `${this._start.format(this.dayDateFormat)}`
          : `${this._start.calendar()} ${this._start.format('MMM DD, YYYY')}`
        break
      case 'week':
        this._range = `${this._start.format('MMM DD')} - ${end.format(
          'DD, YYYY'
        )}`
        break
      case 'month':
        this._range = this.discrete
          ? `${end.format('MMM YYYY')}`
          : `${this._start.format('MMM DD')} - ${end.format('MMM DD, YYYY')}`
        break
      case 'year':
        this._range = this.discrete
          ? `${end.format('YYYY')}`
          : `${this._start.format('MMM DD, YYYY')} - ${end.format(
              'MMM DD, YYYY'
            )}`
        break
    }

    const next = moment(this._start).add(
      this._timeframe.duration,
      this._timeframe.unit
    )
    const major = moment.max(next, this._limit).format('YYYY-MM-DD')
    this._maxReached = major !== this._limit.format('YYYY-MM-DD')

    this.selectedDate.emit({
      current: this._current.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      startDate: this._start.format('YYYY-MM-DD'),
      timeframe: this.timeframe
    })
  }
}
