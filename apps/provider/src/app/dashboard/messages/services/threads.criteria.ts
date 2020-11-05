import { GetAllMessagingRequest } from '@coachcare/npm-api'

export interface ThreadsCriteria extends GetAllMessagingRequest {
  accounts: Array<string>
  limit: number
  offset: number
}
