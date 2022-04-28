import {
  DefaultHeaderComponent,
  DefaultHeaderTitleComponent
} from '@board/pages/register/clinic/header'
import { DefaultInfoDescriptionComponent } from '@board/pages/register/clinic/info-description'
import { DefaultLastStepComponent } from '@board/pages/register/clinic/last-step/default/default.last-step.component'
import { DefaultOrderConfirmComponent } from '../checkout'
import { SectionConfigDetails } from './section.config'

export const DefaultSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: DefaultHeaderComponent,
    HEADER_TITLE: DefaultHeaderTitleComponent,
    INFO: {
      DESCRIPTION: DefaultInfoDescriptionComponent
    },
    LAST_STEP: DefaultLastStepComponent,
    SELF_REGISTER: true
  },
  LOGIN: {
    SHOW_REGISTER_NEW_COMPANY: true,
    USE_COOKIE_BASED_SESSION: true
  },
  CHECKOUT: {
    ORDER_CONFIRM: DefaultOrderConfirmComponent,
    SHOW_REDIRECT_BUTTON: true
  }
}
