/**
 * Interface for IngredientRequest
 */

export interface IngredientRequest {
  ingredientId: string
  type: 'natural' | 'local' | 'branded' | 'common' | 'upc'
  displayUnit: number
  serving: number
}
