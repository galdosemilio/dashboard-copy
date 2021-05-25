export { DeviceStatusComponent } from './devices/device-status.component'
export { DevicesTableComponent } from './devices/table/table.component'
export * from './file-vault'
export { DieterFormsComponent } from './forms/forms.component'
export { DieterFormsTableComponent } from './forms/table/table.component'
export { DieterLabelComponent } from './labels/labels.component'
export { LabelsTableComponent } from './labels/table/table.component'
export { DieterProfileComponent } from './profile/profile.component'
export { DieterSettingsComponent } from './settings.component'
export * from './sequences'
export * from './services'
export * from './meetings'

import { DeviceStatusComponent } from './devices/device-status.component'
import { DevicesTableComponent } from './devices/table/table.component'
import { DieterFileVaultComponent } from './file-vault'
import { DieterFormsComponent } from './forms/forms.component'
import { DieterFormsTableComponent } from './forms/table/table.component'
import { DieterLabelComponent } from './labels/labels.component'
import { LabelsTableComponent } from './labels/table/table.component'
import { DieterProfileComponent } from './profile/profile.component'
import {
  DieterSequencesComponent,
  DieterSequencesTableComponent
} from './sequences'
import { DieterSettingsComponent } from './settings.component'
import { DieterMeetingsComponent } from './meetings'

export const SettingsComponents = [
  DieterFileVaultComponent,
  DeviceStatusComponent,
  DieterLabelComponent,
  DieterMeetingsComponent,
  DieterProfileComponent,
  DieterSequencesComponent,
  DieterSequencesTableComponent,
  DieterSettingsComponent,
  DevicesTableComponent,
  DieterFormsComponent,
  DieterFormsTableComponent,
  LabelsTableComponent
]
