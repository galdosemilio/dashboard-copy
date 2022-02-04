import { NgModule } from '@angular/core'
import { RouterModule, RunGuardsAndResolvers } from '@angular/router'
import {
  FormAnswersResolver,
  FormDisplayComponent,
  FormEditGuard,
  FormResolver,
  FormsComponent,
  FormSubmissionsComponent,
  FormSubmissionsResolver,
  LibraryFormComponent
} from '@app/dashboard/library/forms'
import { DieterSubmissionsComponent } from '@app/shared'
import { ContentComponent } from './content'

const routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'content'
  },
  {
    path: 'content',
    component: ContentComponent
  },
  {
    path: 'forms',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FormsComponent
      },
      {
        path: ':id',
        component: FormDisplayComponent,
        resolve: {
          form: FormResolver
        },
        runGuardsAndResolvers: 'always' as RunGuardsAndResolvers,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'submissions'
          },
          {
            path: 'edit',
            component: LibraryFormComponent,
            canDeactivate: [FormEditGuard],
            resolve: {
              hasSubmissions: FormSubmissionsResolver
            },
            data: {
              readonly: false
            }
          },
          {
            path: 'fill',
            data: {
              fill: true
            },
            component: LibraryFormComponent
          },
          {
            path: 'submissions',
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: FormSubmissionsComponent
              },
              {
                path: ':submissionId',
                component: LibraryFormComponent,
                resolve: {
                  formSubmission: FormAnswersResolver
                },
                data: {
                  readonly: true
                }
              }
            ]
          },
          {
            path: 'dieter-submissions',
            component: DieterSubmissionsComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule {}
