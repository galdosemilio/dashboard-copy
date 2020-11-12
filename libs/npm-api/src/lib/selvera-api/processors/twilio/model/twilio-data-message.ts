import { RawConnectionStats } from './connection-stats'
import { TwilioMobileActivity } from './mob-activity'

export enum TwilioDataMessageType {
  TRACKING,
  MOB_APP_OFF,
  MOB_APP_ON,
  MOB_CAM_OFF,
  MOB_CAM_ON
}

export interface TwilioDataMessage {
  data: RawConnectionStats | TwilioMobileActivity
  type: TwilioDataMessageType
}
