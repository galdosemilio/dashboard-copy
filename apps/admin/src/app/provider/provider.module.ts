import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@coachcare/layout';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@board/shared/shared.module';
import { routes } from './provider.routing';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    LayoutModule,
    SharedModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppProviderModule {}
