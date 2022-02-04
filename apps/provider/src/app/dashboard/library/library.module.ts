import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { LibraryComponents } from '.'
import { AccountsModule } from '../accounts/accounts.module'
import { LibraryContentModule } from './content/content.module'
import { LibraryFormsModule } from './forms/forms.module'
import { LibraryRoutingModule } from './library.routing'

@NgModule({
  imports: [
    LibraryContentModule,
    LibraryFormsModule,
    LibraryRoutingModule,
    AccountsModule,
    SharedModule
  ],
  declarations: LibraryComponents,
  exports: [LibraryContentModule, LibraryFormsModule]
})
export class LibraryModule {}
