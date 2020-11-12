import { RunGuardsAndResolvers } from '@angular/router'
import { ContentComponent } from '@app/dashboard/content'
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

export const LibraryRoutes = [
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
          }
        ]
      }
    ]
  }
]
