import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { AlertsComponents, AlertsProviders } from './'

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  exports: AlertsComponents,
  declarations: AlertsComponents,
  providers: AlertsProviders
})
export class AlertsModule {}
