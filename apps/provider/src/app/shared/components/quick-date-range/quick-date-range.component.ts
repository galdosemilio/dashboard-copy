import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

interface DateRange {
  start: string
  end: string
}

interface QuickSelectOption {
  displayValue: string
  value: string
  generator(): DateRange
}

@UntilDestroy()
@Component({
  selector: 'app-quick-date-range',
  templateUrl: './quick-date-range.component.html',
  styleUrls: ['./quick-date-range.component.scss']
})
export class QuickDateRangeComponent implements OnDestroy, OnInit {
  @Input() set timeframe(value: string) {
    this.initialTimeframe = value
    this.processTimeframeInput(value)
  }

  get timeframe(): string {
    return this._timeframe
  }

  @Input() format: string
  @Output() select: EventEmitter<DateRange> = new EventEmitter<DateRange>()

  form: FormGroup
  options: QuickSelectOption[] = [
    {
      displayValue: _('QUICK_RANGES.LAST_SEVEN_DAYS'),
      value: 'last-7-days',
      generator: () =>
        this.format
          ? {
              start: moment()
                .startOf('day')
                .subtract(7, 'days')
                .format(this.format),
              end: moment().endOf('day').format(this.format)
            }
          : {
              start: moment().startOf('day').subtract(7, 'days').toISOString(),
              end: moment().endOf('day').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.THIS_WEEK'),
      value: 'this-week',
      generator: () =>
        this.format
          ? {
              start: moment().startOf('week').format(this.format),
              end: moment().endOf('week').format(this.format)
            }
          : {
              start: moment().startOf('week').toISOString(),
              end: moment().endOf('week').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.LAST_WEEK'),
      value: 'last-week',
      generator: () =>
        this.format
          ? {
              start: moment()
                .startOf('week')
                .subtract(1, 'week')
                .format(this.format),
              end: moment()
                .endOf('week')
                .subtract(1, 'week')
                .format(this.format)
            }
          : {
              start: moment().startOf('week').subtract(1, 'week').toISOString(),
              end: moment().endOf('week').subtract(1, 'week').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.THIS_MONTH'),
      value: 'this-month',
      generator: () =>
        this.format
          ? {
              start: moment().startOf('month').format(this.format),
              end: moment().endOf('month').format(this.format)
            }
          : {
              start: moment().startOf('month').toISOString(),
              end: moment().endOf('month').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.LAST_MONTH'),
      value: 'last-month',
      generator: () =>
        this.format
          ? {
              start: moment()
                .subtract(1, 'month')
                .startOf('month')
                .format(this.format),
              end: moment()
                .subtract(1, 'month')
                .endOf('month')
                .format(this.format)
            }
          : {
              start: moment()
                .subtract(1, 'month')
                .startOf('month')
                .toISOString(),
              end: moment().subtract(1, 'month').endOf('month').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.LAST_THREE_MONTHS'),
      value: 'last-three-months',
      generator: () =>
        this.format
          ? {
              start: moment()
                .startOf('month')
                .subtract(2, 'month')
                .format(this.format),
              end: moment().endOf('month').format(this.format)
            }
          : {
              start: moment()
                .startOf('month')
                .subtract(2, 'month')
                .toISOString(),
              end: moment().endOf('month').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.LAST_TWELVE_MONTHS'),
      value: 'last-12-months',
      generator: () =>
        this.format
          ? {
              start: moment()
                .startOf('month')
                .subtract(12, 'month')
                .format(this.format),
              end: moment().endOf('day').format(this.format)
            }
          : {
              start: moment()
                .startOf('month')
                .subtract(12, 'month')
                .toISOString(),
              end: moment().endOf('day').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.THIS_YEAR'),
      value: 'this-year',
      generator: () =>
        this.format
          ? {
              start: moment().startOf('year').format(this.format),
              end: moment().endOf('year').format(this.format)
            }
          : {
              start: moment().startOf('year').toISOString(),
              end: moment().endOf('year').toISOString()
            }
    },
    {
      displayValue: _('QUICK_RANGES.ALL_TIME'),
      value: 'all-time',
      generator: () =>
        this.format
          ? {
              start: moment('2000-01-01').format(this.format),
              end: moment().format(this.format)
            }
          : {
              start: moment('2000-01-01').toISOString(),
              end: moment().toISOString()
            }
    }
  ]

  private initialTimeframe: string
  private _timeframe: string

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    this.processTimeframeInput(this.timeframe || this.initialTimeframe)
  }

  private createForm(): void {
    this.form = this.fb.group({
      range: ['']
    })

    this.form.controls.range.setValue(this.options[2].value)

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      const selectedOption = this.options.find(
        (opt) => controls.range === opt.value
      )
      if (selectedOption) {
        this.select.emit(selectedOption.generator())
      }
    })
  }

  private processTimeframeInput(value: string): void {
    const existingTimeframe = this.options.find((opt) => opt.value === value)
    if (existingTimeframe && existingTimeframe.value !== this._timeframe) {
      if (this.form) {
        this._timeframe = value
        this.form.controls.range.setValue(existingTimeframe.value)
      }
    }
  }
}
