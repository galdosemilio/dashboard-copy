import { NgModule } from '@angular/core'
import { SdkApiProviders } from './sdk.barrel'

@NgModule({
  providers: [...SdkApiProviders]
})
export class CoachcareSdkModule {}
