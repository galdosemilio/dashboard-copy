/**
 * GET /content/preference
 */

import { Entity } from '../../../shared';

export interface ContentPreferenceSingle {
  /** Organization entry. */
  organization: Entity;
  /** A flag indicating if the preference entry is active or not. */
  isActive: boolean;
}
