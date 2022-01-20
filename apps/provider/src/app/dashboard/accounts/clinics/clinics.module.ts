import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'
import { CcrCommonPagesModule } from '@coachcare/common/components'

import { ClinicsComponents, ClinicsProviders } from './'

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule, CcrCommonPagesModule],
  exports: ClinicsComponents,
  declarations: ClinicsComponents,
  providers: ClinicsProviders
})
export class ClinicsModule {}
