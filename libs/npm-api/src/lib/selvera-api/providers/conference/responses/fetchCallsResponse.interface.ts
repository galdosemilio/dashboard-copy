import { Pagination } from '../../content/entities'

interface CallParticipant {
  callIdentity?: string
  email: string
  id: string
  firstName: string
  lastName: string
}

/**
 * Interface for GET /conference/video/call (response)
 */

export interface FetchCallsResponse {
  data: Call[]
  pagination: Pagination
}

export interface Call {
  id: string
  initiator: CallParticipant
  participants: {
    attended: Array<CallParticipant>
    requested: Array<CallParticipant>
  }
  room: string
  status: 'in-progress' | 'ended'
  subaccount: {
    id: string
    organization: {
      hierarchyPath: string[]
      id: string
      name: string
    }
  }
  time: {
    end: string
    start: string
  }

  /**
   * @deprecated use 'id' instead
   */
  callId?: string
  /**
   * @deprecated use 'status' instead
   */
  callEnded?: boolean
  /**
   * @deprecated use 'initiator' instead
   */
  initiatorId?: string
  /**
   * @deprecated use 'subaccount.organization' instead
   */
  organizationId?: string
  /**
   * @deprecated use 'subaccount' instead
   */
  subaccountId?: string
}
