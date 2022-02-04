import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AlertsComponent, AlertsSettingsComponent } from './index'

const routes: Routes = [
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule {}
