export * from './chart/chart.component'

import { AggregationSelectorComponent } from './aggregation-selector/aggregation-selector.component'
import { MeasurementChartComponent } from './chart/chart.component'
import { DieterMeasurementsComponent } from './measurements.component'
import { MeasurementTableComponent } from './table/table.component'
import { MeasurementTabsComponent } from './measurement-tabs'
import { MeasurementsTableV2Component } from './table-v2'

export const MeasurementComponents = [
  AggregationSelectorComponent,
  DieterMeasurementsComponent,
  MeasurementChartComponent,
  MeasurementTableComponent,
  MeasurementsTableV2Component,
  MeasurementTabsComponent
]

export const MeasurementEntryComponents = []
