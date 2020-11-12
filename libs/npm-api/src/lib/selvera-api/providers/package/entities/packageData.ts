/**
 * PackageData
 */

export interface PackageData {
  /** The id of this package entry. */
  id: string
  /** The title of this package entry. */
  title: string
  /** The description of this product. */
  description?: string
  /** If this package is active. */
  isActive: boolean
  /** The time this package was created. */
  createdAt: string
  /** The time this package was updated. */
  updatedAt: string
}
