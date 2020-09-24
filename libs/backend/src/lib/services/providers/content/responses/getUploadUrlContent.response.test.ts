/**
 * POST /content/upload
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetUploadUrlContentResponse } from './getUploadUrlContent.response';

export const getUploadUrlContentResponse = createTest<GetUploadUrlContentResponse>(
  'GetUploadUrlContentResponse',
  {
    /** URL to upload the file to. */
    url: t.string,
    /** Key of the item being uploaded. */
    key: t.string,
    /** MIME type of the file to upload. */
    mimeType: t.string
  }
);
