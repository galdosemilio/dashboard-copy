import {
  CommunicationPreferenceSingle,
  ContentPreferenceSingle,
  GetSeqOrgPreferenceResponse,
  MessagingPreferenceSingle,
  OrganizationPreferenceSingle,
  OrganizationSingle
} from '@coachcare/backend/services';
import { RPMPreferenceSingle } from 'selvera-api/dist/lib/selvera-api/providers/rpm/entities';

export interface OrganizationFeaturePrefs {
  associationPrefs: {
    openAddClient: boolean | undefined;
    openAddProvider: boolean | undefined;
  };
  communicationPrefs: CommunicationPreferenceSingle;
  contentPrefs: ContentPreferenceSingle;
  fileVaultPrefs: ContentPreferenceSingle;
  messagingPrefs: MessagingPreferenceSingle;
  onboarding: any;
  rpmPrefs: RPMPreferenceSingle;
  sequencePrefs: GetSeqOrgPreferenceResponse;
}

export interface OrganizationResolved {
  org?: OrganizationSingle;
  featurePrefs?: OrganizationFeaturePrefs;
  prefs?: OrganizationPreferenceSingle;
}

export interface OrganizationParams extends OrganizationResolved {
  editable?: boolean;
}
