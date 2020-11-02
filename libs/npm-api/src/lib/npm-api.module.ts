import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SelveraApiProviders } from './selvera-api.barrel'

@NgModule({
  imports: [CommonModule],
  providers: [...SelveraApiProviders]
})
export class NpmApiModule {}
