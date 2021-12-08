export { DeviceStatusComponent } from './devices/device-status.component'
export { DevicesTableComponent } from './devices/table/table.component'
export * from './file-vault'
export { DieterProfileComponent } from './profile/profile.component'
export { DieterSettingsComponent } from './settings.component'
export { DieterGoalsComponent } from './goals/goals.component'
export * from './phase-history'
export * from './sequences'
export * from './services'
export * from './meetings'

import { DeviceStatusComponent } from './devices/device-status.component'
import { DevicesTableComponent } from './devices/table/table.component'
import { DieterFileVaultComponent } from './file-vault'
import { DieterProfileComponent } from './profile/profile.component'
import {
  DieterSequencesComponent,
  DieterSequencesTableComponent
} from './sequences'
import { DieterSettingsComponent } from './settings.component'
import { DieterMeetingsComponent } from './meetings'
import { DieterGoalsComponent } from './goals/goals.component'
import { DieterPhaseHistoryComponent } from './phase-history'

export const SettingsComponents = [
  DieterFileVaultComponent,
  DeviceStatusComponent,
  DieterMeetingsComponent,
  DieterPhaseHistoryComponent,
  DieterProfileComponent,
  DieterSequencesComponent,
  DieterSequencesTableComponent,
  DieterSettingsComponent,
  DevicesTableComponent,
  DieterGoalsComponent
]
