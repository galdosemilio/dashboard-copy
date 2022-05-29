import { ExtendedMeasurementLabelEntry } from '@app/shared/model'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { createAction, props } from '@ngrx/store'

const Init = createAction('[MEAS LABEL] Init')

const RefreshFeature = createAction('[MEAS LABEL] Refresh Feature')

const RefreshLabelsAndTypes = createAction(
  '[MEAS LABEL] Refresh Labels and Types'
)

const SelectLabel = createAction(
  '[MEAS LABEL] Select Label',
  props<{ label: MeasurementLabelEntry | 'food' }>()
)

const SetLabelsAndTypes = createAction(
  '[MEAS LABEL] Set Labels and Types',
  props<{
    labels: ExtendedMeasurementLabelEntry[]
    types: MeasurementDataPointTypeAssociation[]
  }>()
)

const SetMeasurementPref = createAction(
  '[MEAS LABEL] Set Measurement Preference',
  props<{ preference: MeasurementPreferenceEntry; inherited: boolean }>()
)

export const MeasurementLabelActions = {
  Init,
  RefreshFeature,
  RefreshLabelsAndTypes,
  SelectLabel,
  SetLabelsAndTypes,
  SetMeasurementPref
}
