export * from './display'
export * from './email-template'
export * from './form'
export * from './list'
export * from './settings'

import {
  AddOrganizationDialog,
  OrganizationFeaturePreferenceResolver,
  OrganizationPreferenceResolver,
  OrganizationResolver,
  OrganizationRoutes
} from '@board/services'
import {
  ActiveCampaignDatabase,
  LabelsOrganizationDatabase,
  OrganizationsDatabase
} from '@coachcare/backend/data'
import { CcrOrganizationDialogs } from '@coachcare/common/services'
import {
  OrganizationActiveCampaignComponent,
  OrganizationActiveCampaignTableComponent
} from './active-campaign'
import {
  AssociateActiveCampaignDialogComponent,
  AssociateAllProvidersDialogComponent,
  CreateLabelDialogComponent,
  EditActiveCampaignDialogComponent,
  EnrollProviderCampaignDialogComponent
} from './dialogs'
import { OrganizationsDisplayComponent } from './display'
import {
  EmailTemplateComponent,
  EmailTemplateDialogComponent,
  EmailTemplateTableComponent
} from './email-template'
import { OrganizationsFormComponent } from './form'
import { LabelsAssociationsComponent } from './labels-associations'
import { OrganizationsListComponent, OrganizationsTableComponent } from './list'
import {
  AppIdsComponent,
  BasicInfoComponent,
  BCCInputComponent,
  CcoAddressesComponent,
  ColorsComponent,
  FeaturesComponent,
  ImagesComponent,
  LabelSelectorComponent,
  MALAComponent,
  MFAInputComponent,
  OrganizationsSettingsComponent,
  SecurityComponent
} from './settings'

// Module Collections

export const OrganizationComponents = [
  AddOrganizationDialog,
  AppIdsComponent,
  AssociateActiveCampaignDialogComponent,
  AssociateAllProvidersDialogComponent,
  BasicInfoComponent,
  BCCInputComponent,
  CcoAddressesComponent,
  ColorsComponent,
  CreateLabelDialogComponent,
  EditActiveCampaignDialogComponent,
  EmailTemplateComponent,
  EmailTemplateDialogComponent,
  EmailTemplateTableComponent,
  EnrollProviderCampaignDialogComponent,
  FeaturesComponent,
  ImagesComponent,
  LabelsAssociationsComponent,
  LabelSelectorComponent,
  MALAComponent,
  OrganizationActiveCampaignComponent,
  OrganizationActiveCampaignTableComponent,
  OrganizationsListComponent,
  OrganizationsTableComponent,
  OrganizationsDisplayComponent,
  OrganizationsFormComponent,
  OrganizationsSettingsComponent,
  MFAInputComponent,
  SecurityComponent
]

export const OrganizationProviders = [
  ActiveCampaignDatabase,
  LabelsOrganizationDatabase,

  OrganizationsDatabase,
  CcrOrganizationDialogs,
  OrganizationFeaturePreferenceResolver,
  OrganizationResolver,
  OrganizationPreferenceResolver,
  OrganizationRoutes
]
