/**
 * OrgEntityExtended
 */

import { OrgEntity } from './orgEntity';

export interface OrgEntityExtended extends OrgEntity {
  /** Organization active flag. */
  isActive: boolean;
  /** Organization creation date. */
  createdAt: string;
}
