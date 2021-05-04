import { GetOrgAutoThreadParticipantListingResponse } from '@coachcare/sdk'

export interface ParticipantsCriteria
  extends GetOrgAutoThreadParticipantListingResponse {
  id: string
  offset: number
  limit: number | 'all'
}
