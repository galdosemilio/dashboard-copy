import { GetOrgAutoThreadParticipantListingResponse } from '@coachcare/npm-api'

export interface ParticipantsCriteria extends GetOrgAutoThreadParticipantListingResponse {
  id: string
  offset: number
  limit: number | 'all';
}
