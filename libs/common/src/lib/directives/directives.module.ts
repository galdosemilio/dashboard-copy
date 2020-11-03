import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@coachcare/common/material';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarDirective } from './avatar.directive';
import { BindFormDirective } from './bind-form.directive';
import { DetectKeyDirective } from './detect-key.directive';
import { LinkActiveDirective } from './link-active.directive';
import { LogoDirective } from './logo.directive';
import { NumberOnlyDirective } from './number-only.directive';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatDialogModule, TranslateModule],
  declarations: [
    AvatarDirective,
    BindFormDirective,
    DetectKeyDirective,
    LinkActiveDirective,
    LogoDirective,
    NumberOnlyDirective,
  ],
  exports: [
    AvatarDirective,
    BindFormDirective,
    DetectKeyDirective,
    LinkActiveDirective,
    LogoDirective,
    NumberOnlyDirective,
  ],
})
export class CcrDirectivesModule {}
