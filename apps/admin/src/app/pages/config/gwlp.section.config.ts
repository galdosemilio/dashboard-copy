import { GWLPHeaderComponent } from '../register/clinic/header/gwlp'
import { DefaultReducedLastStepComponent } from '../register/clinic/last-step'
import { SectionConfigDetails } from './section.config'

export const GWLPSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: GWLPHeaderComponent,
    NEWSLETTER_CHECKBOX: true,
    LAST_STEP: DefaultReducedLastStepComponent
  }
}
