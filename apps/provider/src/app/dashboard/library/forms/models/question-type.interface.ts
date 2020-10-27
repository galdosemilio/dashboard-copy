import { FormQuestionTypeSingle } from '@app/shared/selvera-api';

export interface FormQuestionType extends FormQuestionTypeSingle {
  component?: any;
  disregardRequired?: boolean;
  requiresNumericRange?: boolean;
  shouldHideIndex?: boolean;
  usesUrl?: boolean;
}
