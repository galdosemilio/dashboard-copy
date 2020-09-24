/**
 * packageTranslation
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const packageTranslation = createValidator({
  /** Locale of the translation. */
  locale: t.string,
  /** Package title in specific locale. */
  title: t.string,
  /** Package description in specific locale. */
  description: optional(t.string)
});
