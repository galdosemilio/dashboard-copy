import { Routes } from '@angular/router'
import { MeasurementsComponent } from './measurements'
import { MeasurementsDataPointsComponent } from './measurements/data-points'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'management'
  },
  {
    path: 'management',
    component: MeasurementsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'data-points'
      },
      {
        path: 'data-points',
        component: MeasurementsDataPointsComponent
      }
    ]
  }
]
