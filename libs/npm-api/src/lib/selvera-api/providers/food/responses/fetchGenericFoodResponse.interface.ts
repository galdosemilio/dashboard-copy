import { IngredientMetadata } from '../entities/ingredientMetadata.type'

export interface GenericFoodResponse {
  id: string
  name: string
  brand: string
  calories: number
  servingQuantity: number
  servingUnit: string
  servingWeight: number
  thumbnailImage: string
  metadata: IngredientMetadata
}
