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
  WellcoreQuantitySelectorComponent,
  WellcoreThankYouComponent
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
  WellcoreThankYouComponent
]

export const WellcoreProviders = [...SdkApiProviders]
