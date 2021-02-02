/**
 * GET /message/preference/organization/${request.id}/auto-participation
 */

import { PagedResponse } from '../../content/entities'
import { AutoThreadParticipant } from '../entities'

export type GetOrgAutoThreadParticipantListingResponse = PagedResponse<AutoThreadParticipant>
