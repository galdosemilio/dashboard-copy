import { NgModule } from '@angular/core';
import { SelveraApiProviders } from './providers.index';

@NgModule({
  providers: [...SelveraApiProviders]
})
export class CcrSelveraApiModule {}
