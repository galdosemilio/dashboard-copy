/**
 * GET /content/type
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { contentType } from '../../../shared/index.test';
import { GetTypesContentResponse } from './getTypesContent.response';

export const getTypesContentResponse = createTest<GetTypesContentResponse>(
  'GetTypesContentResponse',
  {
    /** An array of content item types. */
    data: t.array(contentType)
  }
);
