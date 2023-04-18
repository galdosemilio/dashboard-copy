export * from './display'
export * from './email-template'
export * from './form'
export * from './list'
export * from './settings'

import {
  AddOrganizationDialog,
  CareManagementPreferencesResolver,
  OrganizationFeaturePreferenceResolver,
  OrganizationPreferenceResolver,
  OrganizationResolver,
  OrganizationRoutes
} from '@board/services'
import {
  LabelsOrganizationDatabase,
  OrganizationsDatabase
} from '@coachcare/backend/data'
import { CcrOrganizationDialogs } from '@coachcare/common/services'
import { CreateLabelDialogComponent } from './dialogs'
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
  CarePreferenceComponent,
  CcoAddressesComponent,
  ColorsComponent,
  FeaturesComponent,
  ImagesComponent,
  LabelSelectorComponent,
  MALAComponent,
  MFAInputComponent,
  OrganizationsEcommerceComponent,
  OrganizationsSettingsComponent,
  SecurityComponent
} from './settings'

// Module Collections

export const OrganizationComponents = [
  AddOrganizationDialog,
  AppIdsComponent,
  BasicInfoComponent,
  BCCInputComponent,
  CarePreferenceComponent,
  CcoAddressesComponent,
  ColorsComponent,
  CreateLabelDialogComponent,
  EmailTemplateComponent,
  EmailTemplateDialogComponent,
  EmailTemplateTableComponent,
  FeaturesComponent,
  ImagesComponent,
  LabelsAssociationsComponent,
  LabelSelectorComponent,
  MALAComponent,
  OrganizationsEcommerceComponent,
  OrganizationsListComponent,
  OrganizationsTableComponent,
  OrganizationsDisplayComponent,
  OrganizationsFormComponent,
  OrganizationsSettingsComponent,
  MFAInputComponent,
  SecurityComponent
]

export const OrganizationProviders = [
  CareManagementPreferencesResolver,
  LabelsOrganizationDatabase,
  OrganizationsDatabase,
  CcrOrganizationDialogs,
  OrganizationFeaturePreferenceResolver,
  OrganizationResolver,
  OrganizationPreferenceResolver,
  OrganizationRoutes
]
