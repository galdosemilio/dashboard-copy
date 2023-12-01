import { APP_INITIALIZER } from '@angular/core'
import { Title } from '@angular/platform-browser'
import {
  StorefrontPaymentMethodEntryComponent,
  StorefrontCategoryIconComponent,
  StorefrontLoadingComponent,
  StorefrontNoticeComponent,
  StorefrontDiscountFormComponent,
  StorefrontSubscribeButtonComponent,
  StorefrontFooterComponent
} from './components'
import {
  StorefrontAddressDialog,
  StorefrontOrderDetailsDialog,
  StorefrontPaymentMethodDialog,
  StorefrontProductDialog,
  StorefrontShoppingPromptDialog
} from './dialogs'
import {
  StorefrontOrderHistoryPageComponent,
  StorefrontCartComponent,
  StorefrontCheckoutComponent,
  StorefrontOrderCompleteComponent,
  StorefrontOrderComponent,
  StorefrontProductComponent,
  StorefrontTermsComponent,
  StorefrontRefundPolicyComponent
} from './pages'
import { StorefrontPaymentManagementPageComponent } from './pages/payment-management'
import {
  StorefrontOrdersDatabase,
  StorefrontPaymentMethodsDatabase,
  StorefrontService,
  StorefrontUserService
} from './services'
import { Storefront } from './storefront'

export const StorefrontComponents = [
  StorefrontOrderHistoryPageComponent,
  StorefrontPaymentManagementPageComponent,
  StorefrontAddressDialog,
  StorefrontProductDialog,
  StorefrontPaymentMethodDialog,
  StorefrontShoppingPromptDialog,
  StorefrontOrderDetailsDialog,
  Storefront,
  StorefrontProductComponent,
  StorefrontOrderComponent,
  StorefrontCartComponent,
  StorefrontCheckoutComponent,
  StorefrontOrderCompleteComponent,
  StorefrontPaymentMethodEntryComponent,
  StorefrontCategoryIconComponent,
  StorefrontLoadingComponent,
  StorefrontNoticeComponent,
  StorefrontDiscountFormComponent,
  StorefrontSubscribeButtonComponent,
  StorefrontTermsComponent,
  StorefrontRefundPolicyComponent,
  StorefrontFooterComponent
]

export const StorefrontProviders = [
  StorefrontService,
  StorefrontUserService,
  StorefrontOrdersDatabase,
  StorefrontPaymentMethodsDatabase,
  Title,
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
