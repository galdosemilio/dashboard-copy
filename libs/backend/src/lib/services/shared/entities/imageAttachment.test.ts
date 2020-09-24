/**
 * imageAttachment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const imageAttachment = createValidator({
  /** Name of the image. */
  name: t.string,
  /** Base64 encoded value of the image. */
  base64: t.string
});
