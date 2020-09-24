/**
 * GET /content/form/section
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { formSectionSingle } from '../../form/responses/formSection.single.test';
import { GetAllFormSectionResponse } from './getAllFormSection.response';

export const getAllFormSectionResponse = createTest<GetAllFormSectionResponse>(
  'GetAllFormSectionResponse',
  {
    /** An array of sections. */
    data: t.array(formSectionSingle),
    /** Pagination object. */
    pagination: pagination
  }
);
