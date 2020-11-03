import {
  ShakeItHeaderComponent,
  ShakeItHeaderTitleComponent
} from '@board/pages/register/clinic/header';
import { ShakeItInfoDescriptionComponent } from '@board/pages/register/clinic/info-description';
import { ShakeItLastStepComponent } from '@board/pages/register/clinic/last-step/shake-it/shake-it.last-step.component';
import { SectionConfigDetails } from './section.config';

export const ShakeItSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: ShakeItHeaderComponent,
    HEADER_TITLE: ShakeItHeaderTitleComponent,
    INFO: {
      DESCRIPTION: ShakeItInfoDescriptionComponent,
      PRIORITY_COUNTRY: ['AU', 'NZ']
    },
    LAST_STEP: ShakeItLastStepComponent
  }
};
