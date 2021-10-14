import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlainLayout } from '@coachcare/layout'

import {
  DownloadPageComponent,
  LoginPageComponent,
  MeetingCancelPageComponent,
  PasswordResetPageComponent,
  PasswordUpdatePageComponent,
  RegisterApplePageComponent,
  RegisterClinicPageComponent,
  RegisterImplementationPageComponent
} from '@board/pages/pages.barrel'
import {
  AppDownloadGuard,
  PagesRoutings,
  PasswordUpdateGuard,
  RouteWildcardGuard,
  SessionGuard
} from '@board/pages/pages.providers'
import {
  NotFoundPageComponent,
  UnsupportedBrowserPageComponent
} from '@board/shared/shared.barrel'
import { MFASetupPageComponent } from './mfa-setup'
import {
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreMedicalIntakeFormComponent,
  WellcoreThankYouComponent
} from './wellcore'

const routes: Routes = [
  {
    path: 'wellcore',
    component: WellcoreContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'blood-sample'
      },
      { path: 'blood-sample', component: WellcoreBloodSampleKitComponent },
      { path: 'cart', component: WellcoreCartComponent },
      { path: 'checkout', component: WellcoreCheckoutComponent },
      {
        path: 'medical-intake-form',
        component: WellcoreMedicalIntakeFormComponent
      },
      {
        path: 'thank-you',
        component: WellcoreThankYouComponent
      }
    ]
  },
  {
    path: '',
    component: PlainLayout,
    children: [
      {
        path: '',
        component: LoginPageComponent,
        canActivate: [SessionGuard],
        pathMatch: 'full'
      },
      {
        path: 'app',
        children: [
          {
            path: ':platform/:organization',
            canActivate: [AppDownloadGuard],
            component: DownloadPageComponent
          }
        ]
      },
      {
        path: 'meeting',
        children: [
          {
            path: 'cancel/:token/:timestamp',
            component: MeetingCancelPageComponent
          }
        ]
      },
      {
        path: 'mfa-setup',
        component: MFASetupPageComponent
      },
      {
        path: 'password',
        children: [
          {
            path: 'reset',
            component: PasswordResetPageComponent
          },
          {
            path: 'update',
            canActivate: [PasswordUpdateGuard],
            component: PasswordUpdatePageComponent
          }
        ]
      },
      // TODO remove backward-compatible
      {
        path: 'passwordResetRequest',
        redirectTo: 'password/reset'
      },
      {
        path: 'passwordReset',
        canActivate: [PasswordUpdateGuard],
        component: PasswordUpdatePageComponent
      },
      {
        path: 'register',
        children: [
          {
            path: 'apple',
            component: RegisterApplePageComponent
          },
          {
            path: 'clinic',
            component: RegisterClinicPageComponent
          },
          {
            path: 'implementation',
            component: RegisterImplementationPageComponent
          }
        ]
      },
      {
        path: 'not-found',
        component: NotFoundPageComponent
      },
      {
        path: 'unsupported-browser',
        component: UnsupportedBrowserPageComponent
      }
    ]
  },
  {
    path: '**',
    canActivate: [RouteWildcardGuard],
    component: PlainLayout,
    children: [
      {
        path: '',
        component: NotFoundPageComponent
      }
    ]
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: PagesRoutings
})
export class PagesRouting {}
