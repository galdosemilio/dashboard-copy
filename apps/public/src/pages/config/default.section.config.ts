import { DefaultHeaderComponent, DefaultHeaderTitleComponent } from '@board/pages/register/clinic/header';
import { DefaultInfoDescriptionComponent } from '@board/pages/register/clinic/info-description';
import { DefaultLastStepComponent } from '@board/pages/register/clinic/last-step/default/default.last-step.component';
import { SectionConfigDetails } from './section.config';

export const DefaultSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: DefaultHeaderComponent,
    HEADER_TITLE: DefaultHeaderTitleComponent,
    INFO: {
      DESCRIPTION: DefaultInfoDescriptionComponent
    },
    LAST_STEP: DefaultLastStepComponent
  }
};
