export * from './display';
export * from './email-template';
export * from './form';
export * from './list';
export * from './settings';
export * from './tree';

import {
  AddOrganizationDialog,
  OrganizationDialogs,
  OrganizationFeaturePreferenceResolver,
  OrganizationPreferenceResolver,
  OrganizationResolver,
  OrganizationRoutes
} from '@board/services';
import {
  ActiveCampaignDatabase,
  LabelsOrganizationDatabase,
  OrganizationsDatabase,
  OrganizationsTreeDatabase
} from '@coachcare/backend/data';
import {
  OrganizationActiveCampaignComponent,
  OrganizationActiveCampaignTableComponent
} from './active-campaign';
import {
  AssociateActiveCampaignDialogComponent,
  AssociateAllProvidersDialogComponent,
  CreateLabelDialogComponent,
  EditActiveCampaignDialogComponent,
  EnrollProviderCampaignDialogComponent
} from './dialogs';
import { OrganizationsDisplayComponent } from './display';
import {
  EmailTemplateComponent,
  EmailTemplateDialogComponent,
  EmailTemplateTableComponent
} from './email-template';
import { OrganizationsFormComponent } from './form';
import { LabelsAssociationsComponent } from './labels-associations';
import { OrganizationsListComponent, OrganizationsTableComponent } from './list';
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
} from './settings';
import { OrganizationsTreeComponent } from './tree';

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
  OrganizationsTreeComponent,
  OrganizationsSettingsComponent,
  MFAInputComponent,
  SecurityComponent
];

export const OrganizationEntryComponents = [
  AddOrganizationDialog,
  AssociateActiveCampaignDialogComponent,
  AssociateAllProvidersDialogComponent,
  CreateLabelDialogComponent,
  EditActiveCampaignDialogComponent,
  EmailTemplateDialogComponent,
  EnrollProviderCampaignDialogComponent
];

export const OrganizationProviders = [
  ActiveCampaignDatabase,
  LabelsOrganizationDatabase,
  OrganizationsTreeDatabase,
  OrganizationsDatabase,
  OrganizationDialogs,
  OrganizationFeaturePreferenceResolver,
  OrganizationResolver,
  OrganizationPreferenceResolver,
  OrganizationRoutes
];
