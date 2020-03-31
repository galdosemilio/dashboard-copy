import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatChipsModule,
  MatGridListModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { CcrDirectivesModule } from '@coachcare/common/directives';
import { MatDatepickerModule } from '@coachcare/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from './avatar/avatar.component';
import { BadgeComponent } from './badge/badge.component';
import { DatasourceOverlayComponent } from './datasource-overlay/datasource-overlay.component';
import { DateNavigatorComponent } from './date-navigator/date-navigator.component';
import { DateRangeNavigatorComponent } from './date-range-navigator/date-range.component';
import { HelpComponent } from './help/help.component';
import { LogoComponent } from './logo/logo.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import { TableOverlayComponent } from './table-overlay/table-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatGridListModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    CcrDirectivesModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AvatarComponent,
    BadgeComponent,
    DatasourceOverlayComponent,
    DateNavigatorComponent,
    DateRangeNavigatorComponent,
    HelpComponent,
    LogoComponent,
    PaginatorComponent,
    ProgressCircleComponent,
    TableOverlayComponent
  ],
  exports: [
    AvatarComponent,
    BadgeComponent,
    DatasourceOverlayComponent,
    DateNavigatorComponent,
    DateRangeNavigatorComponent,
    HelpComponent,
    LogoComponent,
    MatChipsModule,
    PaginatorComponent,
    ProgressCircleComponent,
    TableOverlayComponent
  ]
})
export class CcrUtilityComponentsModule {}
