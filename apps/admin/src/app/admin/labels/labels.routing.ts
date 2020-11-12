import { Routes } from '@angular/router'
import { LabelResolver } from '@board/services'
import { LabelFormComponent, LabelsListComponent } from './labels.index'

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LabelsListComponent },
  {
    path: 'create',
    component: LabelFormComponent,
    data: {
      lbl: {},
      readonly: false
    }
  },
  {
    path: ':id',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info'
      },
      {
        path: 'info',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: LabelFormComponent,
            resolve: { lbl: LabelResolver },
            data: {
              readonly: true
            }
          },
          {
            path: 'edit',
            component: LabelFormComponent,
            resolve: { lbl: LabelResolver },
            data: {
              readonly: false
            }
          }
        ]
      }
    ]
  }
]
