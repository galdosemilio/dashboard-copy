import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { CcrCommonPagesModule } from '@coachcare/common/components'

import { ClinicsComponents, ClinicsProviders } from './'
import { ClinicsRoutingModule } from './clinics.routing'

@NgModule({
  imports: [ClinicsRoutingModule, SharedModule, CcrCommonPagesModule],
  exports: ClinicsComponents,
  declarations: ClinicsComponents,
  providers: ClinicsProviders
})
export class ClinicsModule {}
