/**
 * GET /supplement/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetLocaleSupplementResponse } from './getLocaleSupplement.response';

export const getLocaleSupplementResponse = createTest<GetLocaleSupplementResponse>(
  'GetLocaleSupplementResponse',
  {
    /** Translated full name of the supplement. */
    fullName: t.string,
    /** Translated short name of the supplement. */
    shortName: optional(t.string)
  }
);
