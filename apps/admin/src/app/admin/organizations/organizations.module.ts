import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@board/shared/shared.module'
import { CoachcareSdkModule } from '@coachcare/common'
import {
  CcrCommonPagesModule,
  CcrUtilityComponentsModule
} from '@coachcare/common/components'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { TranslateModule } from '@ngx-translate/core'
import { NgJsonEditorModule } from 'ang-jsoneditor'
import {
  OrganizationComponents,
  OrganizationProviders
} from './organizations.index'
import { routes } from './organizations.routing'

@NgModule({
  imports: [
    CcrDirectivesModule,
    CcrUtilityComponentsModule,
    CcrCommonPagesModule,
    CommonModule,
    ReactiveFormsModule,
    NgJsonEditorModule,
    CoachcareSdkModule,
    MatTableModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: OrganizationComponents,
  providers: OrganizationProviders
})
export class OrganizationsModule {}
