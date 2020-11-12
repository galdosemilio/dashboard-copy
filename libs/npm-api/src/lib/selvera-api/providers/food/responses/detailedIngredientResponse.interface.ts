import { IngredientMetadata } from '../entities/ingredientMetadata.type'
import { IngredientMeasurementResponse } from './ingredientMeasurementsResponse.interface'

export interface DetailedIngredientResponse {
  brand?: string
  calcium: number
  calories: number
  carbohydrate: number
  cholesterol: number
  displayUnit: number
  fiber: number
  highresImage: string
  imageUrl: string
  ingredientId: string
  measurements: Array<IngredientMeasurementResponse>
  name: string
  potassium?: number
  protein: number
  saturatedFat: number
  serving: number
  servingQuantity: number
  servingUnit: number
  servingWeight: number
  sodium: number
  sugar: number
  thumbnailImage: string
  totalFat: number
  metadata: IngredientMetadata
}
