/**
 * GET /content/form
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { formSingle } from '../../form/responses/form.single.test';
import { GetAllFormResponse } from './getAllForm.response';

export const getAllFormResponse = createTest<GetAllFormResponse>('GetAllFormResponse', {
  /** An array of forms. */
  data: t.array(formSingle),
  /** Pagination object. */
  pagination: pagination
});
