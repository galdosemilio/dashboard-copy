import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { Components, Providers } from './'

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: Components,
  providers: Providers
})
export class CallModule {}
