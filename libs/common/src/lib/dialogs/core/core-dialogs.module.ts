import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import {
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule
} from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'

import { ConfirmDialog } from './confirm/confirm.dialog'
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
    TranslateModule
  ],
  declarations: [ConfirmDialog, PromptDialog, LanguagesDialog],
  entryComponents: [ConfirmDialog, PromptDialog, LanguagesDialog],
  exports: [ConfirmDialog, PromptDialog, LanguagesDialog]
})
export class CcrCoreDialogsModule {}
