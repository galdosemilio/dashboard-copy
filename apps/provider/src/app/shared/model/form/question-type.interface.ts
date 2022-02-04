import { FormQuestionTypeSingle } from '@coachcare/sdk'

export interface FormQuestionType extends FormQuestionTypeSingle {
  component?: any
  disregardRequired?: boolean
  requiresNumericRange?: boolean
  shouldHideIndex?: boolean
  usesUrl?: boolean
}
