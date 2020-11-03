import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CcrUtilityComponentsModule } from '@coachcare/common/components';
import { CcrPipesModule } from '@coachcare/common/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { LabelsComponents, LabelsEntryComponents, LabelsProviders } from './labels.index';

import { routes } from './labels.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    TranslateModule.forChild(),
    CdkTableModule,
    SharedModule,
    CcrPipesModule,
    CcrUtilityComponentsModule
  ],
  declarations: [...LabelsComponents],
  entryComponents: LabelsEntryComponents,
  providers: LabelsProviders
})
export class LabelsModule {}

export function LabelsEntrypoint() {
  return LabelsModule;
}
