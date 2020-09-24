/**
 * GET /content/form/question
 */

import { PagedResponse } from '../../../shared';
import { FormQuestionSingle } from '../../form/responses/formQuestion.single';

export type GetAllFormQuestionResponse = PagedResponse<FormQuestionSingle>;
