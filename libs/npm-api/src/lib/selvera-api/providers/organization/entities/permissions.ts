/**
 * Permissions
 */

export interface OrgPermissions {
  viewAll: boolean
  admin: boolean
}

export interface AllOrgPermissions extends OrgPermissions {
  allowClientPhi: boolean
}
