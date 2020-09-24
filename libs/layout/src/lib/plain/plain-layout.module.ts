import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@coachcare/layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BaseComponent } from './base/base.component';
import { PlainLayout } from './plain-layout.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    TranslateModule.forChild(),
    FlexLayoutModule
  ],
  declarations: [BaseComponent, PlainLayout],
  exports: [PlainLayout]
})
export class PlainLayoutModule {}
