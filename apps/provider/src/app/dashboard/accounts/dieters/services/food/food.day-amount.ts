import {
  FetchAllConsumedMealIngredients,
  FetchAllSingleConsumedMealResponse
} from '@app/shared/selvera-api'

export class FoodDayAmount implements FetchAllSingleConsumedMealResponse {
  mealId: string
  consumedDate = undefined
  note = ''
  type = undefined
  metadata = undefined
  calories = 0
  protein = 0
  carbohydrate = 0
  totalFat = 0
  types = []
  meals = []
  level = 0
  isHidden = false
  isExpanded = false

  id: string
  name: string
  imageUrl: string
  saturatedFat = 0
  cholesterol: number
  fiber = 0
  netCarbs = 0
  sugar = 0
  sodium: number
  ingredients?: Array<FetchAllConsumedMealIngredients>

  private hasMeals = false

  get isEmpty(): boolean {
    return !this.hasMeals
  }

  constructor(isHidden, level) {
    this.isHidden = isHidden
    this.level = level
  }

  calculateAmount(meal: FetchAllSingleConsumedMealResponse) {
    this.hasMeals = this.hasMeals || !!meal.mealId
    this.calories += meal.calories
    this.protein += meal.protein
    this.totalFat += meal.totalFat
    this.carbohydrate += meal.carbohydrate
    this.sugar += meal.sugar
    this.fiber += meal.fiber
    this.saturatedFat += meal.saturatedFat
    this.netCarbs = this.carbohydrate ? this.carbohydrate - this.fiber : 0
  }
}
