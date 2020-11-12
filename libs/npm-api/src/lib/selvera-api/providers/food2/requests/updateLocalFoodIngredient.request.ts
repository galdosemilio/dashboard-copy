/**
 * PATCH /food/ingredient/local/:id
 */

import { Image, IngredientType } from '../entities'

export interface UpdateLocalFoodIngredientRequest {
  /** A local identifier of the ingredient. */
  id: string
  /** Name of the ingredient. */
  name?: string
  /** Type of the ingredient. */
  type?: IngredientType
  /** Brand of the ingredient. */
  brand?: string
  /** UPC code. */
  upcCode?: string
  /** Image data. Has to have at least 1 property defined when present. */
  image?: Partial<Image>
}
