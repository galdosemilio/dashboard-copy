import { NamedEntity } from '@coachcare/npm-api'
import * as moment from 'moment'
import { BILLABLE_SERVICES, BillableService } from './billableServices.map'
import { INTERACTION_SOURCES, INTERACTION_TYPES } from './interactionType.map'

interface CallParticipant {
  callIdentity?: string
  email: string
  firstName: string
  id: string
  isInitiator?: boolean
  lastName: string
}

interface CallOrganization {
  id: string
  name: string
}

export class CallHistoryItem {
  billableService: BillableService
  canBeDeleted: boolean
  canUpdateRpmBilling: boolean
  id: string
  initiator: {
    email: string
    firstName: string
    id: string
    lastName: string
  }
  organization?: CallOrganization
  participants: CallParticipant[]
  receiver: { firstName: string; lastName: string }
  time: {
    start: string
    end: string
    duration: number
  }
  type: NamedEntity & { displayName: string }

  constructor(args: any) {
    this.id = args.id
    this.initiator = args.initiator
    this.time = args.time
    this.time.duration = Math.abs(
      moment(this.time.start).diff(moment(this.time.end), 'minutes')
    )
    this.organization = args.organization
    this.participants = args.participants.requested.map((participant) => ({
      email: participant.email,
      firstName: participant.firstName,
      id: participant.id,
      isInitiator: participant.id === this.initiator.id,
      lastName: participant.lastName
    }))
    const interactionType = args.type
      ? Object.values(INTERACTION_TYPES).find(
          (type) => type.id === args.type.id
        )
      : null
    const interactionSource = Object.values(INTERACTION_SOURCES).find(
      (source) => source.id === args.source.id
    )

    this.type = args.type
      ? {
          ...args.type,
          displayName: interactionType
            ? interactionType.displayName
            : args.source.name
        }
      : {
          ...args.source,
          displayName: interactionSource
            ? interactionSource.displayName
            : args.source.name
        }

    if (args.billableService) {
      const billableService = Object.values(BILLABLE_SERVICES).find(
        (billServ) => billServ.id === args.billableService.id
      )

      this.billableService = billableService
        ? billableService
        : { ...args.billableService, displayName: args.billableService.name }
    } else {
      this.billableService = BILLABLE_SERVICES.none
    }

    this.canUpdateRpmBilling = moment().isSameOrBefore(
      moment(this.time.start),
      'month'
    )
    this.canBeDeleted =
      this.type && this.type.id === '2' && this.canUpdateRpmBilling
  }
}
