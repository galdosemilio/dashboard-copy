import {
  CareManagementOrganizationPreference,
  CareManagementServiceType
} from '@coachcare/sdk'

export interface CareManagementFeaturePref {
  serviceType: CareManagementServiceType
  preference?: CareManagementOrganizationPreference
}
