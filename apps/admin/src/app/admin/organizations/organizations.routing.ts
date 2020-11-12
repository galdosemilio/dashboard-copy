import { Routes } from '@angular/router'
import {
  OrganizationFeaturePreferenceResolver,
  OrganizationPreferenceResolver,
  OrganizationResolver
} from '@board/services'

import { OrganizationActiveCampaignComponent } from './active-campaign'
import { OrganizationsDisplayComponent } from './display'
import { EmailTemplateComponent } from './email-template'
import { OrganizationsFormComponent } from './form'
import { LabelsAssociationsComponent } from './labels-associations'
import { OrganizationsListComponent } from './list'
import { OrganizationsSettingsComponent } from './settings'
import { OrganizationsTreeComponent } from './tree'

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
        component: OrganizationsTreeComponent
      },
      {
        path: 'marketing',
        component: OrganizationActiveCampaignComponent
      },
      {
        path: 'settings',
        resolve: {
          prefs: OrganizationPreferenceResolver,
          featurePrefs: OrganizationFeaturePreferenceResolver
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
