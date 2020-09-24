/**
 * POST /organization/:id/preference
 */

import { Color } from '../../../shared';

export interface CreateOrganizationPreferenceRequest {
  /** The id of the organization. */
  id: string;
  /** Logo filename. */
  logoFilename?: string;
  /** Home screen icon filename, 'logoBaseUrl' used as base url */
  iconFilename?: string;
  /** Splash screen image filename, 'logoBaseUrl' used as base url */
  splashFilename?: string;
  /** Favicon filename, 'logoBaseUrl' used as base url */
  faviconFilename?: string;
  /** Logo baseURL. */
  logoBaseUrl?: string;
  /** Display name. */
  displayName?: string;
  /** Color palette. */
  color?: Partial<Color>;
}
