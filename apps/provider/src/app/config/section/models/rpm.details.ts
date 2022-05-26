import { RPMDevice } from '@app/dashboard/reports/rpm/models/rpmDevices.map'

export interface RPMDetails {
  ALLOW_NO_DEVICE_SELECTION?: boolean
  ADDITIONAL_DEVICES?: RPMDevice[]
}
