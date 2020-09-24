/**
 * formRefNamed
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { formRef } from './formRef.test';

export const formRefNamed = createValidator({
  ...formRef.type.props,
  /** Form name. */
  name: t.string
});
