/**
 * orgRef
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const orgRef = createValidator({
  /** Organization ID. */
  id: t.string,
  /**
   * Organization name.
   * While it usually shouldn't be missing,
   * it might be if there is a data consistency issue between the gateway and the service.
   */
  name: optional(t.string)
});
