import { SectionConfigObject } from '@app/config/section/section.config'
import { NamedEntity } from '@coachcare/sdk'

export interface PatientListingConfigDetails {
  SHOW_PATIENT_CREATE_BUTTON?: boolean
  PAYMENT_DISCLAIMER?: SectionConfigObject
  ADDITIONAL_LISTING_COLUMNS?: NamedEntity[]
}
