/**
 * GET /package/:id
 */

import { PackageTranslation } from '../../../shared';

export interface PackageSingle {
  /** The id of this package entry. */
  id: string;
  /** The title of this package entry. */
  title: string;
  /** The description of this product. */
  description?: string;
  /** Indicates whether this package is active. */
  isActive: boolean;
  /** The time this entry was created. */
  createdAt: string;
  /** The time this entry was updated. */
  updatedAt: string;
  /** Translations collection. */
  translations: Array<PackageTranslation>;
}
