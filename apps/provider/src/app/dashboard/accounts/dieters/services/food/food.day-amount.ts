import {
  FetchAllConsumedMealIngredients,
  FetchAllSingleConsumedMealResponse
} from '@coachcare/sdk'
import { ConsumedFood } from '../../models/consumedFood/consumedFood'

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
  moodRating?: string
  imageUrl: string
  saturatedFat = 0
  polyunsaturatedFat = 0
  monounsaturatedFat = 0
  transFat = 0
  calcium = 0
  cholesterol = 0
  fiber = 0
  iron = 0
  netCarbs = 0
  potassium = 0
  sugar = 0
  sodium = 0
  ingredients?: Array<FetchAllConsumedMealIngredients>
  vitaminA = 0
  vitaminB = 0
  vitaminC = 0
  vitaminD = 0

  private hasMeals = false

  get isEmpty(): boolean {
    return !this.hasMeals
  }

  constructor(isHidden, level) {
    this.isHidden = isHidden
    this.level = level
  }

  calculateAmount(meal: ConsumedFood) {
    this.hasMeals = this.hasMeals || !!meal.mealId
    this.calcium += meal.calcium || 0
    this.cholesterol += meal.cholesterol || 0
    this.calories += meal.calories
    this.protein += meal.protein
    this.totalFat += meal.totalFat
    this.carbohydrate += meal.carbohydrate
    this.sodium += meal.sodium || 0
    this.sugar += meal.sugar
    this.fiber += meal.fiber
    this.iron += meal.iron || 0
    this.potassium += meal.potassium || 0
    this.saturatedFat += meal.saturatedFat
    this.transFat += meal.transFat || 0
    this.netCarbs = this.carbohydrate ? this.carbohydrate - this.fiber : 0
    this.vitaminA += meal.vitaminA || 0
    this.vitaminB += meal.vitaminB || 0
    this.vitaminC += meal.vitaminC || 0
    this.vitaminD += meal.vitaminD || 0
    this.polyunsaturatedFat += meal.polyunsaturatedFat || 0
    this.monounsaturatedFat += meal.monounsaturatedFat || 0
  }
}
