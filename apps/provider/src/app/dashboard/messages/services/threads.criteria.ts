import { GetAllMessagingRequest } from '@coachcare/sdk'

export interface ThreadsCriteria extends GetAllMessagingRequest {
  accounts: Array<string>
  limit: number
  offset: number
}
