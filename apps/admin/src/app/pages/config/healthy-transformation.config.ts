import { BariatricAdvantageHeaderComponent } from '../register/clinic/header'
import { DefaultReducedLastStepComponent } from '../register/clinic/last-step'
import { SectionConfigDetails } from './section.config'

export const HealthyTransformationSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: BariatricAdvantageHeaderComponent,
    LAST_STEP: DefaultReducedLastStepComponent,
    NEWSLETTER_CHECKBOX: true
  }
}
