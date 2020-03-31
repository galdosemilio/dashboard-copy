import { NutrimostHeaderComponent } from '../register/clinic/header';
import { DefaultReducedLastStepComponent } from '../register/clinic/last-step';
import { SectionConfigDetails } from './section.config';

export const NutrimostSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: NutrimostHeaderComponent,
    NEWSLETTER_CHECKBOX: true,
    LAST_STEP: DefaultReducedLastStepComponent
  }
};
