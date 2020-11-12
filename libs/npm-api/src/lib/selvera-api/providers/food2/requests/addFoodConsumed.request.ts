/**
 * POST /food/consumed/new
 */

import { ImageUpload } from '../entities'

export interface AddFoodConsumedRequest {
  /**
   * The id of the account that is adding the meal.
   * Clients accounts will be automatically passed and providers can only pass accounts that they have access to.
   */
  account: string
  /** The ID of the type of consumed meal. */
  type: number
  /** The number of servings of this meal consumed. */
  serving: number
  /** Timestamp the meal was consumed. */
  consumedAt: string
  /** The note for the consumed meal. */
  note?: string
  /** The meal that was consumed. */
  meal: {
    /** The name of the meal that is being added. */
    name: string
    /** The image associated with this meal. */
    image?: ImageUpload
    /** The array of meal serving. */
    servings?: Array<{
      /** Serving ID. If ingredient.isLocal is true, this must be the local serving ID. Otherwise it should be a remote serving ID. */
      id: string
      /** A quantity of serving. */
      quantity?: number
      /** The ingredient that is being added to this meal. */
      ingredient: {
        /** The id of the ingredient being added. */
        id: string
        /** Flag saying if ingredient is local or remote. */
        isLocal: boolean
      }
    }>
  }
}
