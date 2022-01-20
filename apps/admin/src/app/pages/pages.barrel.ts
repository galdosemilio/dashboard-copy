import { DownloadPageComponent } from '@board/pages/apps/download/download.component'
import { LoginPageComponent } from '@board/pages/login/login.component'
import { MeetingCancelPageComponent } from '@board/pages/meeting/cancel/cancel.component'
import { MFASetupPageComponent } from '@board/pages/mfa-setup'
import { PasswordResetPageComponent } from '@board/pages/password/reset/reset.component'
import { PasswordUpdatePageComponent } from '@board/pages/password/update/update.component'
import { RegisterApplePageComponent } from '@board/pages/register/apple/apple.component'
import { RegisterClinicPageComponent } from '@board/pages/register/clinic/clinic.component'
import { RegisterClinicInfoPageComponent } from '@board/pages/register/clinic/info/info.component'
import { RegisterClinicPaymentPageComponent } from '@board/pages/register/clinic/payment/payment.component'
import { RegisterImplementationPageComponent } from '@board/pages/register/implementation/implementation.component'
import { PageSectionComponent } from '@board/pages/shared'

import { ClinicPackagesComponents } from './register/clinic/clinic-packages/clinic-packages.barrel'

import { HeaderComponents } from './register/clinic/header/header.barrel'
import { InfoDescriptionComponents } from './register/clinic/info-description/info-description.barrel'
import { LastStepComponents } from './register/clinic/last-step/last-step.barrel'
import { RegisterAppleComponents } from './register/apple/apple.barrel'
import { ImplementationComponents } from './register/implementation/implementation.barrel'
import { PatientPackagesComponents } from './register/clinic/patient-packages/patient-packages.barrel'

export {
  LoginPageComponent,
  DownloadPageComponent,
  MeetingCancelPageComponent,
  PasswordResetPageComponent,
  PasswordUpdatePageComponent,
  RegisterApplePageComponent,
  RegisterClinicPageComponent,
  RegisterClinicInfoPageComponent,
  RegisterClinicPaymentPageComponent,
  RegisterImplementationPageComponent
}

export const PagesComponents = [
  ...ClinicPackagesComponents,
  LoginPageComponent,
  DownloadPageComponent,
  MeetingCancelPageComponent,
  MFASetupPageComponent,
  PageSectionComponent,
  PasswordResetPageComponent,
  PasswordUpdatePageComponent,
  RegisterApplePageComponent,
  RegisterClinicPageComponent,
  RegisterClinicInfoPageComponent,
  RegisterClinicPaymentPageComponent,
  ...HeaderComponents,
  ...InfoDescriptionComponents,
  ...ImplementationComponents,
  ...LastStepComponents,
  ...PatientPackagesComponents,
  ...RegisterAppleComponents
]
