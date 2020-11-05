import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AccountEditDialog } from '@app/dashboard/accounts/dialogs'
import { DietersDatabase } from '@app/dashboard/accounts/dieters/services'
import { SharedModule } from '@app/shared/shared.module'
import { DietersTableComponent } from './table.component'

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [DietersTableComponent],
  declarations: [AccountEditDialog, DietersTableComponent],
  entryComponents: [AccountEditDialog],
  providers: [DietersDatabase]
})
export class DietersTableModule {}
