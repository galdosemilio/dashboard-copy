import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DietersTableModule } from '@app/dashboard/accounts/dieters/table/dieters-table.module'
import { ContentComponents } from '@app/dashboard/content'
import { SharedModule } from '@app/shared/shared.module'
import { FormsComponents, FormsEntryComponents, FormsProviders } from './'

@NgModule({
  imports: [
    CommonModule,
    DietersTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [...FormsComponents, ...ContentComponents],
  exports: [...FormsComponents, ...ContentComponents],
  entryComponents: FormsEntryComponents,
  providers: FormsProviders
})
export class LibraryFormsModule {}
