import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {
  StorefrontCartComponent,
  StorefrontCheckoutComponent,
  StorefrontOrderComponent,
  StorefrontProductComponent,
  StorefrontOrderCompleteComponent,
  StorefrontOrderHistoryPageComponent
} from './pages'
import { StorefrontPaymentManagementPageComponent } from './pages/payment-management'
import { Storefront } from './storefront'

const routes: Routes = [
  {
    path: '',
    component: Storefront,
    children: [
      {
        path: '',
        redirectTo: 'product'
      },
      { path: 'order-history', component: StorefrontOrderHistoryPageComponent },
      {
        path: 'payment-management',
        component: StorefrontPaymentManagementPageComponent
      },
      {
        path: 'product',
        component: StorefrontProductComponent
      },
      {
        path: 'order',
        component: StorefrontOrderComponent,
        children: [
          {
            path: '',
            redirectTo: 'cart'
          },
          {
            path: 'cart',
            component: StorefrontCartComponent
          },
          {
            path: 'checkout',
            component: StorefrontCheckoutComponent
          },
          {
            path: 'complete',
            component: StorefrontOrderCompleteComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorefrontRoutingModule {}
