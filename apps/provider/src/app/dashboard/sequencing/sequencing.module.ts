import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { SequencingComponents, SequencingProviders } from './'
import { SequencingRoutingModule } from './sequencing.routing'

@NgModule({
  imports: [SharedModule, SequencingRoutingModule],
  declarations: SequencingComponents,
  exports: SequencingComponents,
  providers: SequencingProviders
})
export class SequencingModule {}
