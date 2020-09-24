/**
 * Permissions
 */

export interface OrgPermissions {
  viewAll: boolean;
  admin: boolean;
  assignment: boolean;
}

export interface AllOrgPermissions extends OrgPermissions {
  allowClientPhi: boolean;
}
