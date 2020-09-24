import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@coachcare/layout';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@board/shared/shared.module';
import { AdminProviders } from './admin.index';
import { routes } from './admin.routing';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    LayoutModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  providers: AdminProviders,
  exports: [RouterModule],
  declarations: []
})
export class AppAdminModule {}
