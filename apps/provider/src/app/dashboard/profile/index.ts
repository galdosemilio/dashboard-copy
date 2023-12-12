export * from './profile.component'
export * from './form/form.component'
export * from './layouts'

import {
  DeleteAccountDialog,
  VerifyDeleteMFADialog,
  VerifyMFADialog
} from './dialogs'
import { FormComponent as ProfileFormComponent } from './form/form.component'
import { DefaultProfileComponent, WellcoreLayoutComponents } from './layouts'
import { MFAVerificatorComponent } from './mfa-verificator'
import { MFASetupComponent } from './mfa/mfa-setup.component'
import { ProfileComponent } from './profile.component'
import { SecurityComponent } from './security'

export const ProfileComponents = [
  DefaultProfileComponent,
  MFASetupComponent,
  MFAVerificatorComponent,
  ProfileComponent,
  ProfileFormComponent,
  SecurityComponent,
  VerifyDeleteMFADialog,
  DeleteAccountDialog,
  VerifyMFADialog,
  ...WellcoreLayoutComponents
]
