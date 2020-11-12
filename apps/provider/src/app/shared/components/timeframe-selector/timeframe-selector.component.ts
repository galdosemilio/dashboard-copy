import { Component, EventEmitter, Input, Output } from '@angular/core'
import { _, SelectOptions } from '@app/shared/utils/'
import { unitOfTime } from 'moment'

@Component({
  selector: 'ccr-timeframe-selector',
  templateUrl: 'timeframe-selector.component.html',
  styleUrls: ['timeframe-selector.component.scss']
})
export class CcrTimeframeSelectorComponent {
  @Input() timeframe: unitOfTime.DurationConstructor = 'week'
  @Output()
  selectedTimeframe: EventEmitter<
    unitOfTime.DurationConstructor
  > = new EventEmitter<unitOfTime.DurationConstructor>()
  viewTypes: SelectOptions<unitOfTime.DurationConstructor> = [
    { value: 'day', viewValue: _('SELECTOR.VIEWBY.DAY_L') },
    { value: 'week', viewValue: _('SELECTOR.VIEWBY.WEEK_L') },
    { value: 'month', viewValue: _('SELECTOR.VIEWBY.MONTH_L') },
    { value: 'year', viewValue: _('SELECTOR.VIEWBY.YEAR_L') }
    // { value: 'alltime', viewValue: _('SELECTOR.VIEWBY.ALL_TIME_L') }
  ]
  viewby: SelectOptions<unitOfTime.DurationConstructor> = []

  constructor() {
    this.buildViews()
  }

  processAndEmit() {
    this.selectedTimeframe.emit(this.timeframe)
  }

  private buildViews() {
    this.viewby = this.viewTypes
  }
}
