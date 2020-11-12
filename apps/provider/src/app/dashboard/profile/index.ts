export * from './profile.component'
export * from './form/form.component'

import { VerifyDeleteMFADialog, VerifyMFADialog } from './dialogs'
import { FormComponent as ProfileFormComponent } from './form/form.component'
import { MFAVerificatorComponent } from './mfa-verificator'
import { MFASetupComponent } from './mfa/mfa-setup.component'
import { ProfileComponent } from './profile.component'
import { SecurityComponent } from './security'

export const ProfileComponents = [
  MFASetupComponent,
  MFAVerificatorComponent,
  ProfileComponent,
  ProfileFormComponent,
  SecurityComponent,
  VerifyDeleteMFADialog,
  VerifyMFADialog
]

export const UserProfileProviders = []

export const ProfileEntryComponents = [VerifyDeleteMFADialog, VerifyMFADialog]
