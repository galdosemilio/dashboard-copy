import { _ } from '@app/shared/utils'
import { AllOrgPermissions } from '@coachcare/npm-api'
import { isEqual } from 'lodash'

export interface AssociationAccessLevel {
  value: CoachAssociationPermissionOptions
  displayValue: string
  perms: Partial<AllOrgPermissions>
}

export type CoachAssociationPermissionOptions =
  | 'limited-access'
  | 'view-all'
  | 'patient-phi-and-view-all'

export const COACH_ASSOCIATION_ACCESS_LEVELS: {
  [key: string]: AssociationAccessLevel
} = {
  ['limited-access']: {
    value: 'limited-access',
    displayValue: _('PERM.LIMITED_ACCESS'),
    perms: { allowClientPhi: false, viewAll: false }
  },
  ['view-all']: {
    value: 'view-all',
    displayValue: _('PERM.ACCESSALL'),
    perms: { viewAll: true, allowClientPhi: false }
  },
  ['patient-phi-and-view-all']: {
    value: 'patient-phi-and-view-all',
    displayValue: _('PERM.PATIENT_PHI_AND_VIEW_ALL'),
    perms: { allowClientPhi: true, viewAll: true }
  }
}

export function convertPermissionsToAccessLevel(
  perms: Partial<AllOrgPermissions>
): CoachAssociationPermissionOptions {
  const cleanPerms = { ...perms }
  delete cleanPerms.admin
  return (Object.keys(COACH_ASSOCIATION_ACCESS_LEVELS).find((key) =>
    isEqual(COACH_ASSOCIATION_ACCESS_LEVELS[key].perms, cleanPerms)
  ) ?? 'limited-access') as CoachAssociationPermissionOptions
}
