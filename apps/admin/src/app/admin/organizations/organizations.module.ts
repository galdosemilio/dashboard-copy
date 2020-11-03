import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@board/shared/shared.module'
import { CcrUtilityComponentsModule } from '@coachcare/common/components'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { NpmApiModule } from '@coachcare/npm-api'
import { TranslateModule } from '@ngx-translate/core'
import { NgJsonEditorModule } from 'ang-jsoneditor'
import {
  OrganizationComponents,
  OrganizationEntryComponents,
  OrganizationProviders
} from './organizations.index'
import { routes } from './organizations.routing'

@NgModule({
  imports: [
    CcrDirectivesModule,
    CcrUtilityComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    NgJsonEditorModule,
    NpmApiModule,
    MatTableModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: OrganizationComponents,
  entryComponents: OrganizationEntryComponents,
  providers: OrganizationProviders
})
export class OrganizationsModule {}
