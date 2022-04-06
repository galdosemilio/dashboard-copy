import { _ } from '@app/shared/utils'
import { DataPointTypes } from '@coachcare/sdk'
import { SectionConfigDetails } from '../models/section.details'

export const GardenStatePainSectionConfig: SectionConfigDetails = {
  PATIENT_LISTING: {
    ADDITIONAL_LISTING_COLUMNS: [
      {
        id: DataPointTypes.BLOOD_OXYGEN_LEVEL,
        name: _('MEASUREMENT.BLOOD_OXYGEN')
      }
    ]
  }
}
