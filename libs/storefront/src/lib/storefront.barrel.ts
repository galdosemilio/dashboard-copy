import { APP_INITIALIZER } from '@angular/core'
import {
  StorefrontAddressDialog,
  StorefrontPaymentMethodDialog,
  StorefrontProductDialog,
  StorefrontShoppingPromptDialog
} from './dialogs'
import {
  StorefrontCartComponent,
  StorefrontCheckoutComponent,
  StorefrontOrderCompleteComponent,
  StorefrontOrderComponent,
  StorefrontProductComponent
} from './pages'
import { StorefrontService, StorefrontUserService } from './services'
import { Storefront } from './storefront'

export const StorefrontComponents = [
  StorefrontAddressDialog,
  StorefrontProductDialog,
  StorefrontPaymentMethodDialog,
  StorefrontShoppingPromptDialog,
  Storefront,
  StorefrontProductComponent,
  StorefrontOrderComponent,
  StorefrontCartComponent,
  StorefrontCheckoutComponent,
  StorefrontOrderCompleteComponent
]

export const StorefrontProviders = [
  StorefrontService,
  StorefrontUserService,
  {
    provide: APP_INITIALIZER,
    useFactory: onAppInit,
    deps: [StorefrontService],
    multi: true
  }
]

export function onAppInit(storefrontService: StorefrontService) {
  return storefrontService.init()
}
