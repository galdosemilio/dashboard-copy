import { NgModule } from '@angular/core'
import { ContentComponents } from '@app/dashboard'
import { SharedModule } from '@app/shared/shared.module'
import { ContentProviders } from '.'
import { LibraryFormsModule } from '../forms/forms.module'

@NgModule({
  imports: [SharedModule, LibraryFormsModule],
  declarations: ContentComponents,
  exports: ContentComponents,
  providers: ContentProviders
})
export class LibraryContentModule {}
