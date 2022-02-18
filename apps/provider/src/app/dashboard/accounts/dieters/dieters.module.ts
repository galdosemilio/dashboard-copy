import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DietersTableModule } from '@app/dashboard/accounts/dieters/table/dieters-table.module'
import { LibraryFormsModule } from '@app/dashboard/library/forms/forms.module'
import { MessagesModule } from '@app/dashboard/messages/messages.module'
import { ReportsModule } from '@app/dashboard/reports/reports.module'
import { SharedModule } from '@app/shared/shared.module'
import { DietersComponents, DietersProviders } from './'

@NgModule({
  imports: [
    CommonModule,
    DietersTableModule,
    LibraryFormsModule,
    MessagesModule,
    ReportsModule,
    RouterModule,
    SharedModule
  ],
  exports: DietersComponents,
  declarations: DietersComponents,
  providers: DietersProviders
})
export class DietersModule {}
