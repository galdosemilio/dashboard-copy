import { AccountAccessData } from '@coachcare/sdk'

/**
 * ScheduleSelectDialog Data Interface
 */
export interface ScheduleSelectData {
  user: AccountAccessData
  title: string
  button: string
  onlyProviders?: boolean
}
