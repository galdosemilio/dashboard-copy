/**
 * GET /content/form/addendum
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { formAddendumSingle } from '../../form/responses/formAddendum.single.test';
import { GetAllFormAddendumResponse } from './getAllFormAddendum.response';

export const getAllFormAddendumResponse = createTest<GetAllFormAddendumResponse>(
  'GetAllFormAddendumResponse',
  {
    /** An array of addendum. */
    data: t.array(formAddendumSingle),
    /** Pagination object. */
    pagination: pagination
  }
);
