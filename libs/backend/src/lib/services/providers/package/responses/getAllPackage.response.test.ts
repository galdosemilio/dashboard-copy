/**
 * GET /package
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { packageSingle } from '../../package/responses/package.single.test';
import { GetAllPackageResponse } from './getAllPackage.response';

export const getAllPackageResponse = createTest<GetAllPackageResponse>('GetAllPackageResponse', {
  /** A package object record array. */
  data: t.array(packageSingle),
  /** Pagination object. */
  pagination: pagination
});
