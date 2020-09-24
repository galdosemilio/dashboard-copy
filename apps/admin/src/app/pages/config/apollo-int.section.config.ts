import { ApolloHeaderComponent } from '@board/pages/register/clinic/header';
import { DefaultReducedLastStepComponent } from '../register/clinic/last-step';
import { ApolloIntPatientPackagesComponent } from '../register/clinic/patient-packages';
import { SectionConfigDetails } from './section.config';

export const ApolloIntSectionConfig: SectionConfigDetails = {
  REGISTER: {
    HEADER: ApolloHeaderComponent,
    INFO: {
      PACKAGE: ApolloIntPatientPackagesComponent
    },
    LAST_STEP: DefaultReducedLastStepComponent
  }
};
