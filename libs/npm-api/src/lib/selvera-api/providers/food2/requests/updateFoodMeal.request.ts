/**
 * PATCH /food/meal/:id
 */

import { ImageUpload } from '../entities'

export interface UpdateFoodMealRequest {
  /** The ID of meal to update. */
  id: string
  /** Desired new value of `isActive` field at target meal. */
  isActive?: boolean
  /** New name of the meal. Should be non-empty string if passed. */
  name?: string
  /** New vendor of the meal. If 'null' is passed then vendor will be defaulted to 'selvera'. */
  vendor?: string | null
  /** New image associated with this meal. Can be set to 'null'. */
  image?: ImageUpload | null
}
