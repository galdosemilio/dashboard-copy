/**
 * GET /content/form/question-type
 */

import { PagedResponse } from '../../content/entities'
import { FormQuestionTypeSingle } from './formQuestionType.single'

export type GetAllFormQuestionTypeResponse = PagedResponse<
  FormQuestionTypeSingle
>
