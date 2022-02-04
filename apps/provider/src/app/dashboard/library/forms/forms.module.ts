import { NgModule } from '@angular/core'
import { SharedModule } from '@app/shared/shared.module'
import { FormsComponents, FormsProviders } from './'

@NgModule({
  imports: [SharedModule],
  declarations: [...FormsComponents],
  exports: [...FormsComponents],
  providers: FormsProviders
})
export class LibraryFormsModule {}
