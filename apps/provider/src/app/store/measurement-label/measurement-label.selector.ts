import { MeasurementLabelEntry } from '@coachcare/sdk'
import { createSelector } from '@ngrx/store'
import { AppState } from '../state'
import { MeasLabelFeatureState } from './measurement-label.state'

export const measurementLabelSelector = (state: AppState) =>
  state.measurementLabels

export const selectMeasLabelFeature = createSelector(
  measurementLabelSelector,
  (state: MeasLabelFeatureState) => state
)

export const selectDataTypes = createSelector(
  measurementLabelSelector,
  (state: MeasLabelFeatureState) => state.dataPointTypes
)

export const selectMeasurementLabels = createSelector(
  measurementLabelSelector,
  (state: MeasLabelFeatureState) => state.measurementLabels
)

export const selectCurrentLabel = createSelector(
  measurementLabelSelector,
  (state: MeasLabelFeatureState) => state.selectedLabel
)

export const selectCurrentLabelTypes = createSelector(
  measurementLabelSelector,
  (state: MeasLabelFeatureState) =>
    state.selectedLabel && typeof state.selectedLabel === 'object'
      ? state.dataPointTypes.filter(
          (type) =>
            type.label.id === (state.selectedLabel as MeasurementLabelEntry).id
        )
      : state.dataPointTypes
)
