import { FormQuestionTypeSingle } from '@coachcare/npm-api'

export interface FormQuestionType extends FormQuestionTypeSingle {
  component?: any
  disregardRequired?: boolean
  requiresNumericRange?: boolean
  shouldHideIndex?: boolean
  usesUrl?: boolean
}
