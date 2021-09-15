import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AccessDeniedDialogComponent } from '@app/layout/call/access-denied-dialog/access-denied-dialog.component'
import { AccessRequiredDialogComponent } from '@app/layout/call/access-required-dialog/access-required-dialog.component'
import { BrowserSupportDialogComponent } from '@app/layout/call/browser-support-dialog/browser-support-dialog.component'
import { SharedModule } from '@app/shared/shared.module'
import { CallWindowComponent, Components, Providers } from './'

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: Components,
  entryComponents: [
    CallWindowComponent,
    AccessDeniedDialogComponent,
    AccessRequiredDialogComponent,
    BrowserSupportDialogComponent
  ],
  providers: Providers
})
export class CallModule {}
