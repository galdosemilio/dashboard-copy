/**
 * AuthSegment
 */

import { AuthServiceName } from './authServiceName';
import { AuthToken } from './authToken';

export interface AuthSegment {
  /** Denotes the service for which authentication was delegated. */
  service: AuthServiceName;
  /** An object that is present if the user has a token for the service. */
  token?: AuthToken;
}
