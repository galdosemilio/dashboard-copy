import { _ } from '@coachcare/common/shared'
import { AccountTypeIds } from '@coachcare/sdk'
import { SectionConfigDetails } from './section.config'

export const HealthyTransformationSectionConfig: SectionConfigDetails = {
  REGISTER: {
    SELF_REGISTER: false,
    CLINIC_PW_RES_CUSTOM_CHECKBOX: {
      text: _('REGISTER.PASSWORD_UPDATE.HT_NEWSLETTER_CHECKBOX'),
      fieldName: 'clinicNewsletter',
      supportedAccTypes: [
        AccountTypeIds.Provider,
        AccountTypeIds.Client,
        AccountTypeIds.Admin
      ]
    }
  }
}
