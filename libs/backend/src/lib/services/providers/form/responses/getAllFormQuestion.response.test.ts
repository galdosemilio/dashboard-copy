/**
 * GET /content/form/question
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { formQuestionSingle } from '../../form/responses/formQuestion.single.test';
import { GetAllFormQuestionResponse } from './getAllFormQuestion.response';

export const getAllFormQuestionResponse = createTest<GetAllFormQuestionResponse>(
  'GetAllFormQuestionResponse',
  {
    /** An array of questions. */
    data: t.array(formQuestionSingle),
    /** Pagination object. */
    pagination: pagination
  }
);
