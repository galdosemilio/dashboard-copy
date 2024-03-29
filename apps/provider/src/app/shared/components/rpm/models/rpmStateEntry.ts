import { SelectedOrganization } from '@app/service'
import {
  CareManagementServiceType,
  CareManagementStateEntity
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
interface RPMEntryStatus {
  code: string
  displayName: string
}

interface RPMEntryTrigger {
  code: string
  displayName: string
}

interface RPMState extends CareManagementStateEntity {
  status: RPMEntryStatus
  trigger: RPMEntryTrigger
}

export const RPMStateTypes: { [key: string]: RPMEntryStatus } = {
  active: {
    code: 'active',
    displayName: _('RPM.STATE.ACTIVE')
  },
  inactive: {
    code: 'inactive',
    displayName: _('RPM.STATE.INACTIVE')
  },
  neverActive: {
    code: 'never_active',
    displayName: _('RPM.STATE.NEVER_ACTIVE')
  }
}

export const RPMTriggerTypes: { [key: string]: RPMEntryTrigger } = {
  manual: {
    code: 'manual',
    displayName: _('RPM.TRIGGER.MANUAL')
  },
  unknown: {
    code: 'unknown',
    displayName: _('RPM.TRIGGER.UNKNOWN')
  }
}

export type RPMStateEntryPendingStatus = 'same-day' | 'future'

export class RPMStateEntry {
  isActive: boolean
  pending?: RPMStateEntryPendingStatus
  organization: SelectedOrganization
  rpmState: RPMState
  serviceType: CareManagementServiceType

  constructor(args: any, opts: any = {}) {
    const now = moment()
    this.isActive = args.rpmState ? args.rpmState.isActive : false

    if (args.rpmState) {
      if (
        moment(args.rpmState.startedAt).isSame(now, 'day') &&
        moment(args.rpmState.startedAt).isAfter(now)
      ) {
        this.pending = 'same-day'
      } else if (moment(args.rpmState.startedAt).isAfter(now)) {
        this.pending = 'future'
      }
    }

    this.organization = args.rpmState
      ? args.rpmState.organization
      : args.organization || {}
    this.serviceType = args.rpmState?.serviceType ?? {}
    this.rpmState = args.rpmState
      ? {
          ...args.rpmState,
          status: args.rpmState.isActive
            ? RPMStateTypes.active
            : RPMStateTypes.inactive,
          trigger: RPMTriggerTypes[args.rpmState.trigger]
            ? RPMTriggerTypes[args.rpmState.trigger]
            : RPMTriggerTypes.unknown,
          supervisingProvider: {
            ...args.rpmState.supervisingProvider,
            firstName:
              args.rpmState.supervisingProvider?.firstName ||
              _('BOARD.INACCESSIBLE_PROVIDER')
          }
        }
      : { status: RPMStateTypes.neverActive }
  }
}
