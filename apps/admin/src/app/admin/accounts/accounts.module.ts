import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatTableModule } from '@angular/material/table'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '@board/shared/shared.module'
import {
  CcrFormFieldsModule,
  CcrUtilityComponentsModule
} from '@coachcare/common/components'
import { CcrPipesModule } from '@coachcare/common/pipes'

import { AccountsComponents, AccountsProviders } from './accounts.index'
import { routes } from './accounts.routing'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule,
    CcrFormFieldsModule,
    CcrUtilityComponentsModule,
    CcrPipesModule
  ],
  declarations: AccountsComponents,
  providers: AccountsProviders
})
export class AccountsModule {}
