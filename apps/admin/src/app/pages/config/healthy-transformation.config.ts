import { BariatricAdvantageHeaderComponent } from '../register/clinic/header'
import { DefaultReducedLastStepComponent } from '../register/clinic/last-step'
import { SectionConfigDetails } from './section.config'
import { _ } from '@coachcare/backend/shared'

export const HealthyTransformationSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: BariatricAdvantageHeaderComponent,
    LAST_STEP: DefaultReducedLastStepComponent,
    NEWSLETTER_CHECKBOX: true,
    CLINIC_NEWSLETTER_CHECKBOX_TEXT: _(
      'REGISTER.STEP1.HEALTHY_T.NEWSLETTER_CHECK_DESC'
    ),
    CLINIC_MSA: true,
    CLINIC_MSA_LINK:
      'https://www.bariatricadvantage.com/policies#privacy_policy',
    CLINIC_MSA_LINK_LABEL: _('REGISTER.STEP1.HEALTHY_T.CLINIC_MSA')
  }
}
