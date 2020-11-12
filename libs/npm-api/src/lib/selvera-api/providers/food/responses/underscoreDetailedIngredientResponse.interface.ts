import { IngredientMetadata } from '../entities/ingredientMetadata.type'
import { IngredientMeasurementResponse } from './ingredientMeasurementsResponse.interface'

export interface UnderscoreDetailedIngredientResponse {
  serving: number
  display_unit: number
  ingredient_id: string
  name: string
  brand: string
  calories: number
  carbohydrate: number
  cholesterol: number
  protein: number
  fiber: number
  sugar: number
  calcium: number
  potassium: number
  total_fat: number
  saturated_fat: number
  sodium: number
  serving_quantity: number
  serving_unit: number
  serving_weight: number
  thumbnail_image: string
  highres_image: string
  metadata: IngredientMetadata
  measurements: Array<IngredientMeasurementResponse>
}
