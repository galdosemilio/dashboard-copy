import { SdkApiProviders } from '@coachcare/common/sdk.barrel'
import {
  WellcoreHeaderComponent,
  WellcoreFooterComponent,
  WellcoreAccountComponent,
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreShippingInfoComponent,
  WellcoreOrderConfirmComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent,
  WellcoreBillingInfoComponent
} from '.'

export const WellcoreComponents = [
  WellcoreHeaderComponent,
  WellcoreFooterComponent,
  WellcoreAccountComponent,
  WellcoreBillingInfoComponent,
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreOrderConfirmComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreShippingInfoComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent
]

export const WellcoreProviders = [...SdkApiProviders]
