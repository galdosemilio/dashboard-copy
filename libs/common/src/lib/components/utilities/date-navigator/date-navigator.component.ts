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

import * as momentNs from 'moment-timezone'
const moment = momentNs

export interface DateNavigatorOutput {
  current?: string
  endDate?: string
  startDate?: string
  timeframe?: string
}

@Component({
  selector: 'ccr-date-navigator',
  templateUrl: 'date-navigator.component.html'
})
export class DateNavigatorComponent implements OnChanges {
  @HostBinding('class.hidden') hidden = false

  @Input() timeframe: unitOfTime.DurationConstructor = 'day'
  @Input()
  set date(date: string) {
    this._current = moment(date)
    this._start = moment(this._current).startOf(this.timeframe)
  }
  @Input()
  set max(max: boolean | string) {
    this._limit =
      max === true ? moment() : max ? moment(max) : moment('2500-01-01')
  }

  @Output() selectedDate = new EventEmitter<DateNavigatorOutput>()

  _current = moment()
  _start = moment()
  _limit = moment()
  _range: string
  _maxReached = true

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
    const ini = moment(date).startOf(this.timeframe)
    // emit only if the interval will be different
    if (ini.format() !== this._start.format()) {
      this._current = ini
      this._start = moment(this._current).startOf(this.timeframe)
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

  private processAndEmit(): void {
    if (this.timeframe.toString() === 'alltime') {
      this.hidden = true
      this.selectedDate.emit({
        timeframe: this.timeframe,
        current: this._current.format('YYYY-MM-DD'),
        startDate: '2016-01-01',
        endDate: moment().format('YYYY-MM-DD')
      })
      return
    }
    this.hidden = false

    this._start = moment(this._current).startOf(this.timeframe)
    const end = moment(this._start).add(1, this.timeframe).subtract(1, 'day')

    switch (this.timeframe) {
      case 'year':
        this._range = this._start.format('YYYY')
        break
      case 'month':
        this._range = this._start.format('MMM YYYY')
        break
      case 'week':
        this._range = `${this._start.format('MMM D')} - ${end.format(
          'MMM D, YYYY'
        )}`
        break
      case 'day':
      default:
        this._range = this._start.calendar()
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
