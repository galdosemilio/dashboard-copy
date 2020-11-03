import { Routes } from '@angular/router';
import {
  CoachComponent,
  CoachesComponent,
  CoachProfileComponent,
  CoachResolver,
  CoachScheduleComponent
} from './';

export const CoachesRoutes: Routes = [
  { path: '', pathMatch: 'full', component: CoachesComponent },
  {
    path: ':id',
    component: CoachComponent,
    resolve: {
      account: CoachResolver
    }
  }
];
