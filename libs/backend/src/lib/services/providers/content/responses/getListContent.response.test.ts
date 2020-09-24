/**
 * GET /content/view
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { contentSingle } from '../../content/responses/content.single.test';
import { GetListContentResponse } from './getListContent.response';

export const getListContentResponse = createTest<GetListContentResponse>('GetListContentResponse', {
  /** An array of content items. */
  data: t.array(contentSingle),
  /** Pagination object. */
  pagination: pagination
});
