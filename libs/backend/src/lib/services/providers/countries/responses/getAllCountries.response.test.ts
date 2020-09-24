/**
 * GET /country
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { country, pagination } from '../../../shared/index.test';
import { GetAllCountriesResponse } from './getAllCountries.response';

export const getAllCountriesResponse = createTest<GetAllCountriesResponse>(
  'GetAllCountriesResponse',
  {
    /** Country collection. */
    data: t.array(country),
    /** Pagination object. */
    pagination: pagination
  }
);
