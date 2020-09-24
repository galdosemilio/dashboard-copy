/**
 * GET /content/form/submission
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formSubmissionSegment, pagination } from '../../../shared/index.test';
import { GetAllFormSubmissionResponse } from './getAllFormSubmission.response';

export const getAllFormSubmissionResponse = createTest<GetAllFormSubmissionResponse>(
  'GetAllFormSubmissionResponse',
  {
    /** Submission data. */
    data: t.array(formSubmissionSegment),
    /** Pagination object. */
    pagination: pagination
  }
);
