import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatDialogModule } from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'
import { CcrAvatarDirective } from './avatar.directive'
import { BindFormDirective } from './bind-form.directive'
import { DetectKeyDirective } from './detect-key.directive'
import { LinkActiveDirective } from './link-active.directive'
import { LogoDirective } from './logo.directive'
import { NumberOnlyDirective } from './number-only.directive'
import { DebounceEventsDirective } from './debounce-events.directive'

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  declarations: [
    CcrAvatarDirective,
    BindFormDirective,
    DetectKeyDirective,
    LinkActiveDirective,
    LogoDirective,
    NumberOnlyDirective,
    DebounceEventsDirective
  ],
  exports: [
    CcrAvatarDirective,
    BindFormDirective,
    DetectKeyDirective,
    LinkActiveDirective,
    LogoDirective,
    NumberOnlyDirective,
    DebounceEventsDirective
  ]
})
export class CcrDirectivesModule {}
