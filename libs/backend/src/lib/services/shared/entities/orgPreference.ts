/**
 * OrgPreference
 */

import { Color } from '../generic';

export interface OrgPreference {
  /** ID of an organization the preference entry belongs to. */
  id: string;
  /** Full URL of the logo. */
  logoUrl?: string;
  /** Color information. */
  color: Partial<Color>;
}
