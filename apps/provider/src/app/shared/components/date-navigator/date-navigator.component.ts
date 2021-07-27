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
  @Input()
  set date(date: string) {
    this._current = moment(date)
    this._start =
      this.direction === 'backward'
        ? moment(this._current).subtract(1, this.timeframe)
        : moment(this._current)
            .startOf(this.timeframe)
            .add(1, this.timeframe)
            .subtract(1, 'day')
            .endOf('day')
  }
  @Input()
  set max(max: boolean | string) {
    this._limit =
      max === true ? moment() : max ? moment(max) : moment('2500-01-01')

    if (this._current.isSameOrBefore(this._limit, this.timeframe)) {
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
      ? this._current.add(1, this.timeframe)
      : this._current.subtract(1, this.timeframe)

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
        ? moment(this._current).subtract(1, this.timeframe).add(1, 'days')
        : moment(this._current).startOf(this.timeframe)
    const end =
      this.direction === 'backward'
        ? this.discrete
          ? moment(this._current).endOf(this.timeframe)
          : moment(this._current)
        : this.discrete
        ? moment(this._current).endOf(this.timeframe)
        : moment(this._current).endOf(this.timeframe)

    this._start = this.discrete
      ? moment(end).startOf(this.timeframe)
      : this._start

    switch (this.timeframe) {
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

    const next = moment(this._start).add(1, this.timeframe)
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
