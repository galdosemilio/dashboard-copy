import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CcrPipesModule } from '@coachcare/common/pipes'
import {
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule
} from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'

import { ConfirmDialog } from './confirm/confirm.dialog'
import { GridDialog } from './grid'
import { LanguagesDialog } from './language/languages.dialog'
import { PromptDialog } from './prompt/prompt.dialog'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    TranslateModule,
    CcrPipesModule
  ],
  declarations: [ConfirmDialog, GridDialog, PromptDialog, LanguagesDialog],
  exports: [ConfirmDialog, GridDialog, PromptDialog, LanguagesDialog]
})
export class CcrCoreDialogsModule {}
