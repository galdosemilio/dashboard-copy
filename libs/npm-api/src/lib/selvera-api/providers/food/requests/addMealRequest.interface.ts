/**
 * Interface for POST /food/meal
 */

import { IngredientRequest } from './ingredientRequest.interface'

export interface AddMealRequest {
  name: string
  account?: number
  public: boolean
  imageUrl?: string
  ingredients?: IngredientRequest | IngredientRequest[]
}
