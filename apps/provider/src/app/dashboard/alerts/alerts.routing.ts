import { Routes } from '@angular/router';
import { AlertsComponent, AlertsSettingsComponent } from './index';

export const AlertsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'notifications',
        component: AlertsComponent
      },
      {
        path: 'settings',
        component: AlertsSettingsComponent
      }
    ]
  }
];
