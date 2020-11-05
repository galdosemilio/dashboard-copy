import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'
import {
  SequencingComponents,
  SequencingEntryComponents,
  SequencingProviders
} from './'

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [...SequencingComponents, ...SequencingEntryComponents],
  exports: [...SequencingComponents, ...SequencingEntryComponents],
  providers: [...SequencingProviders],
  entryComponents: [...SequencingEntryComponents]
})
export class SequencingModule {}
