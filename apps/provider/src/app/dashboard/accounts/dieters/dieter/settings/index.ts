export { DeviceStatusComponent } from './devices/device-status.component'
export { DevicesTableComponent } from './devices/table/table.component'
export * from './file-vault'
export { DieterFormsComponent } from './forms/forms.component'
export { DieterFormsTableComponent } from './forms/table/table.component'
export { DieterProfileComponent } from './profile/profile.component'
export { DieterSettingsComponent } from './settings.component'
export { DieterGoalsComponent } from './goals/goals.component'
export * from './sequences'
export * from './services'
export * from './meetings'

import { DeviceStatusComponent } from './devices/device-status.component'
import { DevicesTableComponent } from './devices/table/table.component'
import { DieterFileVaultComponent } from './file-vault'
import { DieterFormsComponent } from './forms/forms.component'
import { DieterFormsTableComponent } from './forms/table/table.component'
import { DieterProfileComponent } from './profile/profile.component'
import {
  DieterSequencesComponent,
  DieterSequencesTableComponent
} from './sequences'
import { DieterSettingsComponent } from './settings.component'
import { DieterMeetingsComponent } from './meetings'
import { DieterGoalsComponent } from './goals/goals.component'
export const SettingsComponents = [
  DieterFileVaultComponent,
  DeviceStatusComponent,
  DieterMeetingsComponent,
  DieterProfileComponent,
  DieterSequencesComponent,
  DieterSequencesTableComponent,
  DieterSettingsComponent,
  DevicesTableComponent,
  DieterFormsComponent,
  DieterFormsTableComponent,
  DieterGoalsComponent
]
