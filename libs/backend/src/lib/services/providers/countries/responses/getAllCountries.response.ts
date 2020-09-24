/**
 * GET /country
 */

import { Country, PagedResponse } from '../../../shared';

export type GetAllCountriesResponse = PagedResponse<Country>;
