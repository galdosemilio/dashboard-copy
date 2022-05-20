import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  ExtendedMeasurementLabelEntry,
  MeasurementLabelService
} from '@app/service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

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

  constructor(private measurementLabel: MeasurementLabelService) {
    this.fetchMeasurementLabels = this.fetchMeasurementLabels.bind(this)
  }

  public ngOnInit(): void {
    this.measurementLabel.loaded$
      .pipe(untilDestroyed(this))
      .subscribe(this.fetchMeasurementLabels)
  }

  public onSelectTab(label: ExtendedMeasurementLabelEntry | string): void {
    this.onSelect.emit(label)
  }

  private async fetchMeasurementLabels(): Promise<void> {
    const labels = await this.measurementLabel.fetchMeasurementLabels()
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
