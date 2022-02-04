import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'

import { MessagesComponents, MessagesProviders } from './'
import { MessagesRoutingModule } from './messages.routing'

@NgModule({
  imports: [MessagesRoutingModule, SharedModule],
  exports: MessagesComponents,
  declarations: MessagesComponents,
  providers: MessagesProviders
})
export class MessagesModule {}
