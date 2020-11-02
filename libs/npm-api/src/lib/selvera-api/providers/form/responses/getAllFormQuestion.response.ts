/**
 * GET /content/form/question
 */

import { PagedResponse } from '../../content/entities';
import { FormQuestionSingle } from './formQuestion.single';

export type GetAllFormQuestionResponse = PagedResponse<FormQuestionSingle>;
