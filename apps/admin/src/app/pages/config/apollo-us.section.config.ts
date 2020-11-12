import {
  ApolloHeaderComponent,
  ApolloHeaderTitleComponent
} from '@board/pages/register/clinic/header'
import { ApolloInfoDescriptionComponent } from '@board/pages/register/clinic/info-description'
import { ApolloLastStepComponent } from '@board/pages/register/clinic/last-step/apollo/apollo.last-step.component'
import { ApolloUSPatientPackagesComponent } from '../register/clinic/patient-packages/apollo-us/apollo-us.patient-packages.component'
import { SectionConfigDetails } from './section.config'

export const ApolloUSSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: ApolloHeaderComponent,
    HEADER_TITLE: ApolloHeaderTitleComponent,
    INFO: {
      PACKAGE: ApolloUSPatientPackagesComponent,
      DESCRIPTION: ApolloInfoDescriptionComponent
    },
    LAST_STEP: ApolloLastStepComponent
  }
}
