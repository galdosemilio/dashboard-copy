/**
 * GET /content/:id/package
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../../../shared/index.test';
import { GetAllContentPackageResponse } from './getAllContentPackage.response';

export const getAllContentPackageResponse = createTest<GetAllContentPackageResponse>(
  'GetAllContentPackageResponse',
  {
    /** An array of packages. */
    data: t.array(entity)
  }
);
