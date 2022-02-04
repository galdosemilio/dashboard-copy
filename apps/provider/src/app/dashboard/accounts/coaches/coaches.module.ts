import { NgModule } from '@angular/core'
import { ReportsModule } from '@app/dashboard/reports/reports.module'
import { SharedModule } from '@app/shared/shared.module'
import { ClinicsModule } from '../clinics/clinics.module'
import { CoachesComponents, CoachesProviders } from './'
import { CoachesRoutingModule } from './coaches.routing'

@NgModule({
  imports: [CoachesRoutingModule, SharedModule, ClinicsModule, ReportsModule],
  exports: CoachesComponents,
  declarations: CoachesComponents,
  providers: CoachesProviders
})
export class CoachesModule {}
