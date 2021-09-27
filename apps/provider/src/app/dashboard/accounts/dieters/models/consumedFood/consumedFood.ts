import {
  FetchAllConsumedMealIngredients,
  FetchAllSingleConsumedMealResponse,
  FoodConsumedSingle
} from '@coachcare/sdk'
import * as moment from 'moment'

export class ConsumedFood implements FetchAllSingleConsumedMealResponse {
  calories: number
  calcium: number
  carbohydrate: number
  cholesterol: number
  consumedAtMidnight?: boolean
  consumedDate: string
  fiber: number
  hasImageUrl: boolean
  hasMultipleIngredients: boolean
  id: string
  image: { thumbnail: string; highres: string }
  imageUrl: string
  ingredients: FetchAllConsumedMealIngredients[]
  iron: number
  mealId: string
  metadata: any
  monounsaturatedFat: number
  name: string
  netCarbs: number
  note: string
  moodRating?: number
  polyunsaturatedFat: number
  potassium: number
  protein: number
  saturatedFat: number
  serving?: number
  sodium: number
  sugar: number
  totalFat: number
  transFat: number
  type: string
  vitaminA: number
  vitaminB: number
  vitaminC: number
  vitaminD: number

  constructor(args: FoodConsumedSingle) {
    this.polyunsaturatedFat = args.summary.polyunsaturatedFat || 0
    this.monounsaturatedFat = args.summary.monounsaturatedFat || 0
    this.transFat = args.summary.transFat || 0
    this.calcium = args.summary.calcium || 0
    this.calories = args.summary.calorie || 0
    this.carbohydrate = args.summary.carbohydrate || 0
    this.cholesterol = args.summary.cholesterol || 0
    this.consumedDate = moment(args.consumedAt).toISOString()
    this.consumedAtMidnight = moment(args.consumedAt).isSame(
      moment(args.consumedAt).startOf('day')
    )
    this.fiber = args.summary.fiber || 0
    this.id = args.id
    this.iron = args.summary.iron || 0
    this.hasImageUrl = !!args.meal.imageUrl
    this.image = {
      thumbnail: args.meal.imageUrl || 'assets/image-placeholder.png',
      highres: args.meal.imageUrl || 'assets/image-placeholder.png'
    }
    this.imageUrl = this.image.highres
    this.mealId = args.meal.id
    this.metadata = {}
    this.name = args.meal.name
    this.note = args.note
    this.moodRating = args.moodRating
    this.potassium = args.summary.potassium || 0
    this.protein = args.summary.protein || 0
    this.saturatedFat = args.summary.saturatedFat || 0
    this.sodium = args.summary.sodium || 0
    this.sugar = args.summary.sugar || 0
    this.totalFat = args.summary.totalFat || 0
    this.type = args.type['description'].toLowerCase()
    this.netCarbs = this.carbohydrate ? this.carbohydrate - this.fiber : 0
    this.serving = Number(args.serving)
    this.vitaminA = args.summary.vitaminA || 0
    this.vitaminB = args.summary.vitaminB || 0
    this.vitaminC = args.summary.vitaminC || 0
    this.vitaminD = args.summary.vitaminD || 0
  }
}
