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
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent
} from '.'

export const WellcoreComponents = [
  WellcoreAccountComponent,
  WellcoreActivitiesFormComponent,
  WellcoreAdditionalQuestionsFormComponent,
  WellcoreBloodSampleKitComponent,
  WellcoreCartComponent,
  WellcoreCheckoutComponent,
  WellcoreContainerComponent,
  WellcoreMainFormComponent,
  WellcoreMedicalIntakeFormComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreThankYouComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreShippingInfoComponent,
  WellcoreQuantitySelectorComponent,
  WellcoreReviewOrderComponent
]

export const WellcoreProviders = [...SdkApiProviders]
