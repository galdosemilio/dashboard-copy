import {
  SyntheticDataPointType,
  SyntheticDataPointTypeId
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'

export interface NamedSyntheticDataPointType extends SyntheticDataPointType {
  name: string
}

export const SYNTHETIC_DATA_TYPES: NamedSyntheticDataPointType[] = [
  {
    id: SyntheticDataPointTypeId.BloodPressure,
    sourceTypeIds: ['6', '5'],
    name: _('MEASUREMENT.BLOOD_PRESSURE')
  }
]
