/**
 * GET /content/form/question-type
 */

import { PagedResponse } from '../../../shared';
import { FormQuestionTypeSingle } from '../../form/responses/formQuestionType.single';

export type GetAllFormQuestionTypeResponse = PagedResponse<FormQuestionTypeSingle>;
