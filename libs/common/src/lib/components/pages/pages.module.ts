import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  OrganizationsDatabase,
  OrganizationsTreeDatabase
} from '@coachcare/backend/data'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { CcrMaterialModule } from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'
import { CcrOrganizationTreePageComponent } from '.'

@NgModule({
  imports: [
    CommonModule,
    CcrDirectivesModule,
    CcrMaterialModule,
    TranslateModule.forChild()
  ],
  declarations: [CcrOrganizationTreePageComponent],
  exports: [CcrOrganizationTreePageComponent],
  providers: [OrganizationsDatabase, OrganizationsTreeDatabase]
})
export class CcrCommonPagesModule {}
