import { Routes } from '@angular/router'
import {
  CareManagementPreferencesResolver,
  OrganizationFeaturePreferenceResolver,
  OrganizationPreferenceResolver,
  OrganizationResolver
} from '@board/services'
import { CcrOrganizationTreePageComponent } from '@coachcare/common/components'

import { OrganizationsDisplayComponent } from './display'
import { EmailTemplateComponent } from './email-template'
import { OrganizationsFormComponent } from './form'
import { LabelsAssociationsComponent } from './labels-associations'
import { OrganizationsListComponent } from './list'
import { OrganizationsSettingsComponent } from './settings'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OrganizationsListComponent
  },
  {
    path: 'create',
    component: OrganizationsDisplayComponent,
    data: {
      editable: true
    }
  },
  {
    path: ':id',
    component: OrganizationsDisplayComponent,
    resolve: {
      org: OrganizationResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data'
      },
      {
        path: 'data',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: OrganizationsFormComponent
          },
          {
            path: 'edit',
            component: OrganizationsFormComponent,
            // TODO implement CanDeactivate
            data: {
              editable: true
            }
          }
        ]
      },
      {
        path: 'tree',
        component: CcrOrganizationTreePageComponent
      },
      {
        path: 'settings',
        resolve: {
          prefs: OrganizationPreferenceResolver,
          featurePrefs: OrganizationFeaturePreferenceResolver,
          carePrefs: CareManagementPreferencesResolver
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: OrganizationsSettingsComponent
          },
          {
            path: 'edit',
            component: OrganizationsSettingsComponent,
            data: {
              editable: true
            }
          }
        ]
      },
      {
        path: 'email-template',
        component: EmailTemplateComponent
      },
      {
        path: 'labels',
        component: LabelsAssociationsComponent
      }
    ]
  }
]
