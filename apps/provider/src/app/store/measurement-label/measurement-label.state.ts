import { ExtendedMeasurementLabelEntry } from '@app/shared/model'
import { MeasurementDataPointTypeAssociation } from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'

export interface MeasLabelFeatureState {
  dataPointTypes: MeasurementDataPointTypeAssociation[]
  measurementLabels: ExtendedMeasurementLabelEntry[]
  preference: MeasurementPreferenceEntry | null
  preferenceIsInherited: boolean
  selectedLabel: ExtendedMeasurementLabelEntry | 'food' | null
}

export const measLabelInitialState: MeasLabelFeatureState = {
  dataPointTypes: [],
  measurementLabels: [],
  preference: null,
  preferenceIsInherited: false,
  selectedLabel: null
}
