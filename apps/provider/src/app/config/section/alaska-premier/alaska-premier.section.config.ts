import { _ } from '@app/shared/utils'
import { DataPointTypes } from '@coachcare/sdk'
import { SectionConfigDetails } from '../models/section.details'

export const AlaskaPremierSectionConfig: SectionConfigDetails = {
  PATIENT_LISTING: {
    ADDITIONAL_LISTING_COLUMNS: [
      {
        id: DataPointTypes.HEART_RATE,
        name: _('MEASUREMENT.HEART_RATE')
      }
    ]
  }
}
