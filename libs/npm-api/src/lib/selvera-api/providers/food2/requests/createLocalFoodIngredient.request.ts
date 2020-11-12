/**
 * POST /food/ingredient/local
 */

import { Image, IngredientType } from '../entities'

export interface CreateLocalFoodIngredientRequest {
  /** Name of the ingredient. */
  name: string
  /** Type of the ingredient. */
  type?: IngredientType
  /** Brand of the ingredient. */
  brand?: string
  /** UPC code. */
  upcCode?: string
  /** Image data. Has to have at least 1 property defined when present. */
  image?: Partial<Image>
  /** Serving collection. */
  servings?: Array<{
    /** A description of a serving. */
    description: string
    /** A measurement description. */
    measurementDescription?: string
    /** Unit of a serving. */
    unit: string
    /** Amount of a serving in the specified unit. */
    amount: number
    /** External ID of a serving. */
    externalId?: string
    /** Calorie amount (kcal) */
    calorie?: number
    /** Carbohydrate amount (mg) */
    carbohydrate?: number
    /** Cholesterol amount (mg) */
    cholesterol?: number
    /** Total fat amount (mg) */
    totalFat?: number
    /** Monounsaturated fat amount (mg) */
    monounsaturatedFat?: number
    /** Polyunsaturated fat amount (mg) */
    polyunsaturatedFat?: number
    /** Fiber amount (mg) */
    fiber?: number
    /** Potassium amount (mg) */
    potassium?: number
    /** Protein amount (mg) */
    protein?: number
    /** Sodium amount (mg) */
    sodium?: number
  }>
}
