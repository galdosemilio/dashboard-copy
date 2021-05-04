import { OrgAccessRequest } from '@coachcare/sdk'

export interface ClinicCriteria extends OrgAccessRequest {
  admin?: boolean // with admin permissions
  assignment?: boolean // with assignment permission
  viewAll?: boolean // with access permissions
  allowClientPhi?: boolean // with access permissions
  // clinic picker
  newAccount?: boolean
  pickedOnly?: boolean
}
