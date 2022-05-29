import { createReducer, on } from '@ngrx/store'
import { MeasurementLabelActions } from './measurement-label.actions'
import { measLabelInitialState } from './measurement-label.state'

export const measurementLabelReducer = createReducer(
  measLabelInitialState,
  on(
    MeasurementLabelActions.SetMeasurementPref,
    (state, { preference, inherited }) => ({
      ...state,
      preference,
      preferenceIsInherited: inherited
    })
  ),
  on(MeasurementLabelActions.SetLabelsAndTypes, (state, { labels, types }) => ({
    ...state,
    measurementLabels: labels,
    dataPointTypes: types
  })),
  on(MeasurementLabelActions.SelectLabel, (state, { label }) => ({
    ...state,
    selectedLabel: label
  }))
)
