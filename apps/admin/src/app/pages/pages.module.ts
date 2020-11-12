import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@board/shared/shared.module'
import { QRCodeModule } from 'angularx-qrcode'
import { PagesComponents, PagesEntryComponents } from './pages.barrel'
import { PagesProviders } from './pages.providers'
import { PagesRouting } from './pages.routing'
import { PagesStoreModule } from './store'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PagesRouting,
    SharedModule,
    PagesStoreModule.forParent(),
    QRCodeModule
  ],
  exports: [RouterModule],
  declarations: PagesComponents,
  entryComponents: PagesEntryComponents,
  providers: PagesProviders
})
export class AppPagesModule {}
