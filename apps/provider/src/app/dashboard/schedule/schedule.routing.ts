import { Routes } from '@angular/router'
import { PatientAccountGuard, ProviderAccountGuard } from '@app/service'
import {
  ScheduleAvailabilityComponent,
  ScheduleAvailabilityRecurringComponent,
  ScheduleAvailabilitySingleDayComponent,
  ScheduleCalendarComponent
} from './'
import { ScheduleListComponent } from './list'
import { ScheduleMosaicComponent } from './mosaic'

export const ScheduleRoutes: Routes = [
  {
    path: 'view',
    component: ScheduleCalendarComponent,
    canActivate: [ProviderAccountGuard]
  },
  {
    path: 'available',
    component: ScheduleAvailabilityComponent,
    canActivate: [ProviderAccountGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'recurring' },
      { path: 'recurring', component: ScheduleAvailabilityRecurringComponent },
      { path: 'single', component: ScheduleAvailabilitySingleDayComponent }
    ]
  },
  {
    path: 'list',
    component: ScheduleListComponent,
    canActivate: [ProviderAccountGuard]
  },
  {
    path: 'mosaic',
    component: ScheduleMosaicComponent,
    canActivate: [PatientAccountGuard]
  }
]
