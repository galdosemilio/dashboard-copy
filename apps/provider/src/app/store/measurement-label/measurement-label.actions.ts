import { ExtendedMeasurementLabelEntry } from '@app/shared/model'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { createAction, props } from '@ngrx/store'

const Init = createAction('[MEASUREMENT LABEL] Init')

const RefreshFeature = createAction('[MEASUREMENT LABEL] Refresh Feature')

const RefreshLabelsAndTypes = createAction(
  '[MEASUREMENT LABEL] Refresh Labels and Types'
)

const SelectLabel = createAction(
  '[MEASUREMENT LABEL] Select Label',
  props<{ label: MeasurementLabelEntry | 'food' }>()
)

const SetLabelsAndTypes = createAction(
  '[MEASUREMENT LABEL] Set Labels and Types',
  props<{
    labels: ExtendedMeasurementLabelEntry[]
    types: MeasurementDataPointTypeAssociation[]
  }>()
)

const SetMeasurementPref = createAction(
  '[MEASUREMENT LABEL] Set Measurement Preference',
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
