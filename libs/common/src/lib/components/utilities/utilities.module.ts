import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CcrDirectivesModule } from '@coachcare/common/directives'
import { CcrMaterialModule } from '@coachcare/material'
import { TranslateModule } from '@ngx-translate/core'
import { CcrAvatarComponent } from './avatar/avatar.component'
import { BadgeComponent } from './badge/badge.component'
import { CcrDatasourceOverlayComponent } from './datasource-overlay/datasource-overlay.component'
import { DateNavigatorComponent } from './date-navigator/date-navigator.component'
import { DateRangeNavigatorComponent } from './date-range-navigator/date-range.component'
import { PopupDescriptionComponent } from './description'
import { HelpComponent } from './help/help.component'
import { LogoComponent } from './logo/logo.component'
import { CcrNoticeBlockquoteComponent } from './notice-blockquote'
import { CcrPaginatorComponent } from './paginator/paginator.component'
import { ProgressCircleComponent } from './progress-circle/progress-circle.component'
import { TableOverlayComponent } from './table-overlay/table-overlay.component'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    CcrDirectivesModule,
    CcrMaterialModule,
    TranslateModule.forChild()
  ],
  declarations: [
    CcrAvatarComponent,
    BadgeComponent,
    CcrNoticeBlockquoteComponent,
    CcrDatasourceOverlayComponent,
    DateNavigatorComponent,
    DateRangeNavigatorComponent,
    HelpComponent,
    LogoComponent,
    CcrPaginatorComponent,
    PopupDescriptionComponent,
    ProgressCircleComponent,
    TableOverlayComponent
  ],
  exports: [
    CcrAvatarComponent,
    BadgeComponent,
    CcrNoticeBlockquoteComponent,
    CcrDatasourceOverlayComponent,
    DateNavigatorComponent,
    DateRangeNavigatorComponent,
    HelpComponent,
    LogoComponent,
    CcrPaginatorComponent,
    PopupDescriptionComponent,
    ProgressCircleComponent,
    TableOverlayComponent
  ]
})
export class CcrUtilityComponentsModule {}
