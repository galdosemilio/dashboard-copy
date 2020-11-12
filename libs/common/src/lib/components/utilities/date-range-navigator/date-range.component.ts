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

export interface DateRangeNavigatorOutput {
  diff?: number
  format?: string
  startDate?: string
  endDate?: string
}

@Component({
  selector: 'ccr-date-range-navigator',
  templateUrl: 'date-range.component.html'
})
export class DateRangeNavigatorComponent implements OnChanges {
  @HostBinding('class.hidden') hidden = false

  @Input()
  set start(date: undefined | string | momentNs.Moment) {
    if (date) {
      this._start = moment(date)
    }
  }
  @Input()
  set end(date: undefined | string | momentNs.Moment) {
    if (date) {
      this._end = moment(date)
    }
  }
  @Input()
  set maxDiff(min: momentNs.Duration) {
    this._maxDiff = min
  }
  @Input()
  set max(max: boolean | string | momentNs.Moment) {
    this._limit =
      max === true ? moment() : max ? moment(max) : moment('2500-01-01')
  }

  @Output() selectedDate = new EventEmitter<DateRangeNavigatorOutput>()

  _start = moment().subtract(1, 'month')
  _end = moment()

  _maxDiff = moment.duration(1, 'year')
  _limit = moment()
  _min = moment().subtract(1, 'year')
  _maxReached = false
  _dateFormat: string

  constructor() {}

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
    const diff = moment(this._end).diff(this._start, 'days')
    return diff >= 28 && diff <= 31 ? [1, 'month'] : [diff, 'days']
  }

  pickStart(date: momentNs.Moment) {
    if (!moment(date).isSame(this._start, 'days')) {
      this._start = moment(date)
      this.processAndEmit()
    }
  }

  pickEnd(date: momentNs.Moment) {
    if (!moment(date).isSame(this._end, 'days')) {
      this._end = moment(date)
      this.processAndEmit()
    }
  }

  changeDate(next: boolean): void {
    if (next && this._maxReached) {
      return
    }

    const diff = this.interval

    if (next) {
      this._start.add(diff[0], diff[1])
      this._end.add(diff[0], diff[1])
    } else {
      this._start.subtract(diff[0], diff[1])
      this._end.subtract(diff[0], diff[1])
    }

    this.processAndEmit()
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
    this.hidden = false

    this.validateMaxDiff()
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
        this._dateFormat = 'MMM YYYY'
        break
      default:
        // < 62 bars
        this._dateFormat = 'D MMM YYYY'
    }

    this.selectedDate.emit({
      diff: moment(this._end).diff(this._start, 'days'),
      format: this._dateFormat,
      startDate: this._start.format('YYYY-MM-DD'),
      endDate: this._end.format('YYYY-MM-DD')
    })
  }
}
