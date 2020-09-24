/**
 * GET /package/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetLocalePackageResponse } from './getLocalePackage.response';

export const getLocalePackageResponse = createTest<GetLocalePackageResponse>(
  'GetLocalePackageResponse',
  {
    /** Translated title of the package. */
    title: t.string,
    /** Translated description of the package. */
    description: optional(t.string)
  }
);
