import { NgModule } from '@angular/core'
import { ContentComponents } from '@app/dashboard'
import { SharedModule } from '@app/shared/shared.module'
import { ContentProviders } from '.'

@NgModule({
  imports: [SharedModule],
  declarations: ContentComponents,
  exports: ContentComponents,
  providers: ContentProviders
})
export class LibraryContentModule {}
