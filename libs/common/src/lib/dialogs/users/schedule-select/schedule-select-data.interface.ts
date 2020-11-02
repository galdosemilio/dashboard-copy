import { AccountAccessData } from '@coachcare/npm-api'

/**
 * ScheduleSelectDialog Data Interface
 */
export interface ScheduleSelectData {
  user: AccountAccessData
  title: string
  button: string
  onlyProviders?: boolean
}
