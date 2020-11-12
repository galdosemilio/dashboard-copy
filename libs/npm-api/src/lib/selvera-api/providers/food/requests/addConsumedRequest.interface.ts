/**
 * Interface for POST /food/consumed
 */

import { IngredientRequest } from './ingredientRequest.interface'

export interface AddConsumedRequest {
  account?: string
  category: 'new' | 'existing'
  consumedDate: string
  note?: string
  imageUrl?: string
  ingredients?: Array<IngredientRequest>
  mealId?: number | string
  name?: string
  organization?: string
  serving: number
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}
