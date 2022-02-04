import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'

import { AlertsComponents, AlertsProviders } from './'
import { AlertsRoutingModule } from './alerts.routing'

@NgModule({
  imports: [AlertsRoutingModule, SharedModule],
  exports: AlertsComponents,
  declarations: AlertsComponents,
  providers: AlertsProviders
})
export class AlertsModule {}
