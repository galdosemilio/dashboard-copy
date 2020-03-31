import { InHealthHeaderComponent, InHealthHeaderTitleComponent } from '../register/clinic/header';
import { InHealthInfoDescriptionComponent } from '../register/clinic/info-description';
import { InHealthLastStepComponent } from '../register/clinic/last-step';
import { SectionConfigDetails } from './section.config';

export const InHealthSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: InHealthHeaderComponent,
    HEADER_TITLE: InHealthHeaderTitleComponent,
    INFO: {
      DESCRIPTION: InHealthInfoDescriptionComponent
    },
    NEWSLETTER_CHECKBOX: true,
    LAST_STEP: InHealthLastStepComponent
  }
};
