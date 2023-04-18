import {
  CareManagementPreference,
  CommunicationPreferenceSingle,
  ContentPreferenceSingle,
  GetSeqOrgPreferenceResponse,
  MessagingPreferenceSingle,
  OrganizationPreferenceSingle,
  OrganizationSingle,
  OrgSchedulePreferencesResponse
} from '@coachcare/sdk'
import { CareManagementFeaturePref } from './care-management.types'

export interface OrganizationFeaturePrefs {
  associationPrefs: {
    openAddClient: boolean | undefined
    openAddProvider: boolean | undefined
  }
  communicationPrefs: CommunicationPreferenceSingle
  contentPrefs: ContentPreferenceSingle
  fileVaultPrefs: ContentPreferenceSingle
  messagingPrefs: MessagingPreferenceSingle
  onboarding: any
  rpmPrefs: CareManagementPreference
  sequencePrefs: GetSeqOrgPreferenceResponse
  schedulePrefs: OrgSchedulePreferencesResponse
}

export interface OrganizationResolved {
  org?: OrganizationSingle
  featurePrefs?: OrganizationFeaturePrefs
  prefs?: OrganizationPreferenceSingle
  carePrefs?: CareManagementFeaturePref[]
}

export interface OrganizationParams extends OrganizationResolved {
  editable?: boolean
}
