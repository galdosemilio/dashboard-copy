/**
 * GET /content
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { contentSingle } from '../../content/responses/content.single.test';
import { GetAllContentResponse } from './getAllContent.response';

export const getAllContentResponse = createTest<GetAllContentResponse>('GetAllContentResponse', {
  /** An array of content items. */
  data: t.array(contentSingle),
  /** Pagination object. */
  pagination: pagination
});
