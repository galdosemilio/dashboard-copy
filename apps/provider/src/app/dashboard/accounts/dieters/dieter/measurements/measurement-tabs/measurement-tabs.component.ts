import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ExtendedMeasurementLabelEntry } from '@app/shared/model'
import {
  MeasurementLabelActions,
  selectMeasurementLabels
} from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import { MeasurementLabelEntry } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'

@UntilDestroy()
@Component({
  selector: 'app-dieter-measurements-tabs',
  templateUrl: './measurement-tabs.component.html',
  styleUrls: ['./measurement-tabs.component.scss']
})
export class MeasurementTabsComponent implements OnInit {
  @Input() hiddenMeasurementTabs = []
  @Input() section = ''

  @Output()
  onSelect: EventEmitter<ExtendedMeasurementLabelEntry | string> =
    new EventEmitter<ExtendedMeasurementLabelEntry | string>()

  public measurementLabels: ExtendedMeasurementLabelEntry[] = []

  constructor(private store: Store<AppState>) {
    this.setMeasurementLabels = this.setMeasurementLabels.bind(this)
  }

  public ngOnInit(): void {
    this.store
      .select(selectMeasurementLabels)
      .pipe(untilDestroyed(this))
      .subscribe(this.setMeasurementLabels)
  }

  public onSelectTab(label: ExtendedMeasurementLabelEntry | 'food'): void {
    this.onSelect.emit(label)
    this.store.dispatch(
      MeasurementLabelActions.SelectLabel({
        label: label as MeasurementLabelEntry | 'food'
      })
    )
  }

  private setMeasurementLabels(labels: ExtendedMeasurementLabelEntry[]): void {
    this.measurementLabels = labels

    const matchingLabel = this.section
      ? labels.find((label) => label.name.toLowerCase())
      : null

    if (matchingLabel) {
      this.onSelectTab(matchingLabel)
      return
    }

    if (!this.measurementLabels.length) {
      if (!this.hiddenMeasurementTabs.includes('food')) {
        this.onSelectTab('food')
      }
      return
    }

    this.onSelectTab(this.measurementLabels[0])
  }
}
