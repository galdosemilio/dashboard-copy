import { NgModule } from '@angular/core'
import { LibraryContentModule } from '@app/dashboard/library/content/content.module'
import { MessagesModule } from '@app/dashboard/messages/messages.module'
import { ReportsModule } from '@app/dashboard/reports/reports.module'
import { SharedModule } from '@app/shared/shared.module'
import { DietersComponents, DietersProviders } from './'
import { DietersRoutingModule } from './dieters.routing'

@NgModule({
  imports: [
    DietersRoutingModule,
    ReportsModule,
    MessagesModule,
    LibraryContentModule,
    SharedModule
  ],
  exports: DietersComponents,
  declarations: DietersComponents,
  providers: DietersProviders
})
export class DietersModule {}
