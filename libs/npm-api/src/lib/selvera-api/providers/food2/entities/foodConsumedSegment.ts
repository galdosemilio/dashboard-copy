/**
 * FoodConsumedSegment
 */

export interface FoodConsumedSegment {
  /** The id of the consumed meal record. */
  id: string
  /** The name of the consumed meal record. */
  name: string
  /** The type of meal. */
  type: string
  /** The url of the image of meal. */
  image_url: string
  /** The date the meal was consumed. */
  consumed_date: string
  /** The amount of protein in meal in (mg) */
  protein: number
  /** The amount of total_fat in meal in (mg) */
  total_fat: number
  /** The amount of saturated fat in meal in (mg) */
  saturated_fat: number
  /** The amount of cholesterol in meal in (mg) */
  cholesterol: number
  /** The amount of fiber in meal in (mg) */
  fiber: number
  /** The amount of sugar in meal in (mg) */
  sugar: number
  /** The amount of sodium in meal in (mg) */
  sodium: number
  /** The amount of carbohydrate in meal. */
  carbohydrate: number
  /** Object representing ingredients in this meal. */
  ingredients: {
    /** The name of the ingredients.record. */
    name: string
    /** The number of kilocalories of the ingredients.as mg per "serving_weight" of ingredient. */
    calories: number
    /** The number of servings of this ingredient in the meal. */
    serving_quantity: number
    /** The unit of measurement this ingredient is measured in. */
    display_unit: number
    /** Additional metadata regarding ingredient. */
    metadata: any
  }
}
