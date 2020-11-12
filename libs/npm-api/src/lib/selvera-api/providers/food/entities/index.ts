import { KeyDataEntity } from '../../foodKey/entities'
import { IngredientMetadata } from './ingredientMetadata.type'

/**
 * Food interfaces
 */
export interface EntityWithDescription {
  id: string
  description: string
}

export interface FoodMeasurement {
  unit: string
  weight: number
  quantity: number
}

export interface Ingredient {
  name: string
  displayUnit: string
  servingQuantity: number
  calories: number
  metadata: IngredientMetadata
  measurements: Array<FoodMeasurement>
}

export interface Meal {
  id: string
  name: string
  public: boolean
  imageUrl: string
  category: string
  createdAt: string
  calories?: number
  ingredients?: Array<Ingredient>
  plans?: Array<MealPlan>
  keys: Array<FoodKeyData>
}

export interface FoodKeyData {
  key: KeyDataEntity
  quantity: number
  keyOrganizationId: string
}

export interface Recipe {
  ingredients: Array<string>
  servings: Array<string>
  steps: Array<string>
}

export interface MealPlanItem {
  recipe?: Recipe
  dayOfWeek: number
  type: EntityWithDescription
}

export interface MealPlan {
  id: string
  description: string
  items: Array<MealPlanItem>
}
