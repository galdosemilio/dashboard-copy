import { MeasurementLabelEntry } from '@coachcare/sdk'
import { createSelector } from '@ngrx/store'
import { AppState } from '../state'
import { MeasLabelFeatureState } from './measurement-label.state'

export const measLabelSelector = (state: AppState) => state.measurementLabels

export const selectMeasLabelFeature = createSelector(
  measLabelSelector,
  (state: MeasLabelFeatureState) => state
)

export const selectDataTypes = createSelector(
  measLabelSelector,
  (state: MeasLabelFeatureState) => state.dataPointTypes
)

export const selectMeasurementLabels = createSelector(
  measLabelSelector,
  (state: MeasLabelFeatureState) => state.measurementLabels
)

export const selectCurrentLabel = createSelector(
  measLabelSelector,
  (state: MeasLabelFeatureState) => state.selectedLabel
)

export const selectCurrentLabelTypes = createSelector(
  measLabelSelector,
  (state: MeasLabelFeatureState) =>
    state.selectedLabel && typeof state.selectedLabel === 'object'
      ? state.dataPointTypes.filter(
          (type) =>
            type.label.id === (state.selectedLabel as MeasurementLabelEntry).id
        )
      : state.dataPointTypes
)
