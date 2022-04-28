import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@board/shared/shared.module'
import { QRCodeModule } from 'angularx-qrcode'
import { NgxStripeModule } from 'ngx-stripe'
import { environment } from '../../environments/environment'
import { PagesComponents } from './pages.barrel'
import { PagesProviders } from './pages.providers'
import { PagesRouting } from './pages.routing'
import { PagesStoreModule } from './store'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxStripeModule.forRoot(environment.stripeKey),
    PagesRouting,
    SharedModule,
    PagesStoreModule.forParent(),
    QRCodeModule
  ],
  exports: [RouterModule],
  declarations: PagesComponents,
  providers: PagesProviders
})
export class AppPagesModule {}
