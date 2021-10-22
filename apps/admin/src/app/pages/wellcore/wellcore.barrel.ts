import { SdkApiProviders } from '@coachcare/common/sdk.barrel'
import {
  WellcoreAccountComponent,
  WellcoreActivitiesFormComponent,
  WellcoreAdditionalQuestionsFormComponent,
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreMainFormComponent,
  WellcoreMedicalIntakeFormComponent,
  WellcoreThankYouComponent,
  WellcoreShippingInfoComponent,
  WellcoreOrderConfirmComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent,
  WellcoreBillingInfoComponent
} from '.'

export const WellcoreComponents = [
  WellcoreAccountComponent,
  WellcoreActivitiesFormComponent,
  WellcoreAdditionalQuestionsFormComponent,
  WellcoreBillingInfoComponent,
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreMainFormComponent,
  WellcoreMedicalIntakeFormComponent,
  WellcoreOrderConfirmComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreThankYouComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreShippingInfoComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent
]

export const WellcoreProviders = [...SdkApiProviders]
