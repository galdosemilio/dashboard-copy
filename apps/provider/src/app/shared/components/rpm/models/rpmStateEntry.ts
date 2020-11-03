import { SelectedOrganization } from '@app/service';
import { RPMState as SelveraRPMState } from '@app/shared/selvera-api';
import { _ } from '@app/shared/utils';

interface RPMEntryStatus {
  code: string;
  displayName: string;
}

interface RPMEntryTrigger {
  code: string;
  displayName: string;
}

interface RPMState extends SelveraRPMState {
  status: RPMEntryStatus;
  trigger: RPMEntryTrigger;
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
};

export const RPMTriggerTypes: { [key: string]: RPMEntryTrigger } = {
  manual: {
    code: 'manual',
    displayName: _('RPM.TRIGGER.MANUAL')
  },
  unknown: {
    code: 'unknown',
    displayName: _('RPM.TRIGGER.UNKNOWN')
  }
};

export class RPMStateEntry {
  isActive: boolean;
  organization: SelectedOrganization;
  rpmState: RPMState;

  constructor(args: any, opts: any = {}) {
    this.isActive = args.rpmState ? args.rpmState.isActive : false;
    this.organization = args.rpmState
      ? args.rpmState.organization
      : args.organization || {};
    this.rpmState = args.rpmState
      ? {
          ...args.rpmState,
          status: args.rpmState.isActive ? RPMStateTypes.active : RPMStateTypes.inactive,
          trigger: RPMTriggerTypes[args.rpmState.trigger]
            ? RPMTriggerTypes[args.rpmState.trigger]
            : RPMTriggerTypes.unknown
        }
      : { status: RPMStateTypes.neverActive };
  }
}
