import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClinicsModule } from '@app/dashboard/accounts/clinics/clinics.module';
import { ReportsModule } from '@app/dashboard/reports/reports.module';
import { SharedModule } from '@app/shared/shared.module';
import { CoachesComponents, CoachesProviders } from './';

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule, ClinicsModule, ReportsModule],
  exports: CoachesComponents,
  declarations: CoachesComponents,
  providers: CoachesProviders
})
export class CoachesModule {}
