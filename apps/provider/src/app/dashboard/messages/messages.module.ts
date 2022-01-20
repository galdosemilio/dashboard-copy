import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'

import { MessagesComponents, MessagesProviders } from './'
import { MessagesRoutes } from './messages.routing'

@NgModule({
  imports: [CommonModule, RouterModule.forChild(MessagesRoutes), SharedModule],
  exports: MessagesComponents,
  declarations: MessagesComponents,
  providers: MessagesProviders
})
export class MessagesModule {}
