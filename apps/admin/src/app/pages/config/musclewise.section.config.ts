import { _ } from '@coachcare/common/shared'
import { AccountTypeIds } from '@coachcare/sdk'
import { MuscleWiseOrderConfirmComponent } from '../checkout'
import { SectionConfigDetails } from './section.config'

export const MuscleWiseSectionConfig: SectionConfigDetails = {
  REGISTER: {
    CLINIC_PW_RES_CUSTOM_CHECKBOX: {
      text: _('REGISTER.PASSWORD_UPDATE.MW_CUSTOM_CHECKBOX'),
      fieldName: 'customConsent',
      supportedAccTypes: [AccountTypeIds.Client],
      links: [
        {
          text: _('REGISTER.PASSWORD_UPDATE.MW_CUSTOM_LINK'),
          url: 'http://www.musclewise.com/programaccessiblity'
        }
      ]
    }
  },
  CHECKOUT: {
    ORDER_CONFIRM: MuscleWiseOrderConfirmComponent,
    SHOW_REDIRECT_BUTTON: false
  }
}
