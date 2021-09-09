import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  ExtendedMeasurementLabelEntry,
  MeasurementLabelService
} from '@app/service'

@Component({
  selector: 'app-dieter-measurements-tabs',
  templateUrl: './measurement-tabs.component.html',
  styleUrls: ['./measurement-tabs.component.scss']
})
export class MeasurementTabsComponent implements OnInit {
  @Input() section = ''

  @Output()
  onSelect: EventEmitter<
    ExtendedMeasurementLabelEntry | string
  > = new EventEmitter<ExtendedMeasurementLabelEntry | string>()

  public hiddenMeasurementTabs = []
  public measurementLabels: ExtendedMeasurementLabelEntry[] = []

  constructor(private measurementLabel: MeasurementLabelService) {}

  public ngOnInit(): void {
    this.fetchMeasurementLabels()
  }

  public onSelectTab(label: ExtendedMeasurementLabelEntry | string): void {
    this.onSelect.emit(label)
  }

  private async fetchMeasurementLabels(): Promise<void> {
    const labels = await this.measurementLabel.fetchMeasurementLabels()
    this.measurementLabels = labels

    if (!this.measurementLabels.length) {
      if (!this.hiddenMeasurementTabs.includes('food')) {
        this.onSelectTab('food')
      }
      return
    }

    this.onSelectTab(this.measurementLabels[0])
  }
}
