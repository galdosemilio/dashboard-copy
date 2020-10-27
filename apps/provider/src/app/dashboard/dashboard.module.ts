import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponents, DashboardEntryComponents, DashboardProviders } from './';
import { ClinicsModule } from './accounts/clinics/clinics.module';
import { CoachesModule } from './accounts/coaches/coaches.module';
import { DietersModule } from './accounts/dieters/dieters.module';
import { DietersTableModule } from './accounts/dieters/table/dieters-table.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardRoutes } from './dashboard.routing';
import { LibraryFormsModule } from './library/forms/forms.module';
import { ReportsModule } from './reports/reports.module';
import { SequencingModule } from './sequencing/sequencing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AlertsModule,
    LibraryFormsModule,
    ReportsModule,
    ClinicsModule,
    CoachesModule,
    DietersModule,
    DietersTableModule,
    DashboardRoutes,
    SequencingModule
  ],
  exports: [RouterModule],
  declarations: DashboardComponents,
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}
