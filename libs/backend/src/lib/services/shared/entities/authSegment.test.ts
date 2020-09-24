/**
 * authSegment
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import { authServiceName } from './authServiceName.test';
import { authToken } from './authToken.test';

export const authSegment = createValidator({
  /** Denotes the service for which authentication was delegated. */
  service: authServiceName,
  /** An object that is present if the user has a token for the service. */
  token: optional(authToken)
});
