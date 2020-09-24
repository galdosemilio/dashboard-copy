/**
 * GET /content/form/question-type
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { formQuestionTypeSingle } from '../../form/responses/formQuestionType.single.test';
import { GetAllFormQuestionTypeResponse } from './getAllFormQuestionType.response';

export const getAllFormQuestionTypeResponse = createTest<GetAllFormQuestionTypeResponse>(
  'GetAllFormQuestionTypeResponse',
  {
    /** An array of question types. */
    data: t.array(formQuestionTypeSingle),
    /** Pagination object. */
    pagination: pagination
  }
);
