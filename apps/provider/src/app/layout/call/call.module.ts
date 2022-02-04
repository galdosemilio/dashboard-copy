import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { Components, Providers } from './'

@NgModule({
  imports: [SharedModule],
  declarations: Components,
  providers: Providers
})
export class CallModule {}
