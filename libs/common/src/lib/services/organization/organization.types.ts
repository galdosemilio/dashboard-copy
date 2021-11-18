import {
  CommunicationPreferenceSingle,
  ContentPreferenceSingle,
  GetSeqOrgPreferenceResponse,
  MessagingPreferenceSingle,
  OrganizationPreferenceSingle,
  OrganizationSingle,
  OrgSchedulePreferencesResponse,
  RPMPreferenceSingle
} from '@coachcare/sdk'

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
  rpmPrefs: RPMPreferenceSingle
  sequencePrefs: GetSeqOrgPreferenceResponse
  schedulePrefs: OrgSchedulePreferencesResponse
}

export interface OrganizationResolved {
  org?: OrganizationSingle
  featurePrefs?: OrganizationFeaturePrefs
  prefs?: OrganizationPreferenceSingle
}

export interface OrganizationParams extends OrganizationResolved {
  editable?: boolean
}