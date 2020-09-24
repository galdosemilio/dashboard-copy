import { Routes } from '@angular/router';
import { ReportsListComponent } from './reports.index';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ReportsListComponent
  }
];
