import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatProgressSpinnerModule } from '@coachcare/material'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'

import { SharedModule } from '@board/shared/shared.module'
import { CcrUtilityComponentsModule } from '@coachcare/common/components'

import {
  UserLogsComponents,
  UserLogsEntryComponents,
  UserLogsProviders
} from './userlogs.index'

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    RouterModule,
    TranslateModule.forChild(),
    SharedModule,
    CcrUtilityComponentsModule
  ],
  declarations: UserLogsComponents,
  entryComponents: UserLogsEntryComponents,
  providers: UserLogsProviders,
  exports: UserLogsComponents
})
export class UserLogsModule {}
