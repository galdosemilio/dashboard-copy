/**
 * SupplementItemLoc
 */

import { SupplementTranslation } from './supplementTranslation';

export interface SupplementItemLoc {
  /** ID of the supplement. */
  id: string;
  /** Full name of the supplement. */
  fullName: string;
  /** Supplement abbreviated name. */
  shortName: string;
  /** Supplement activity status flag. */
  isActive: boolean;
  /** Translation list. */
  translations: Array<SupplementTranslation>;
}
