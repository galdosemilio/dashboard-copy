import { NgModule } from '@angular/core'
import { SelveraApiProviders } from './selvera-api.barrel'

@NgModule({
  imports: [],
  providers: [...SelveraApiProviders]
})
export class NpmApiModule {}
