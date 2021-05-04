import {
  FetchAllConsumedMealIngredients,
  FetchAllSingleConsumedMealResponse,
  FoodConsumedSingle
} from '@coachcare/sdk'
import * as moment from 'moment'

export class ConsumedFood implements FetchAllSingleConsumedMealResponse {
  calories: number
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
  mealId: string
  metadata: any
  name: string
  netCarbs: number
  note: string
  protein: number
  saturatedFat: number
  serving?: number
  sodium: number
  sugar: number
  totalFat: number
  type: string

  constructor(args: FoodConsumedSingle) {
    this.calories = args.summary.calorie || 0
    this.carbohydrate = args.summary.carbohydrate || 0
    this.cholesterol = args.summary.cholesterol || 0
    this.consumedDate = moment(args.consumedAt).toISOString()
    this.consumedAtMidnight = moment(args.consumedAt).isSame(
      moment(args.consumedAt).startOf('day')
    )
    this.fiber = args.summary.fiber || 0
    this.id = args.id
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
    this.protein = args.summary.protein || 0
    this.saturatedFat = args.summary.saturatedFat || 0
    this.sodium = args.summary.sodium || 0
    this.sugar = args.summary.sugar || 0
    this.totalFat = args.summary.totalFat || 0
    this.type = args.type['description'].toLowerCase()
    this.netCarbs = this.carbohydrate ? this.carbohydrate - this.fiber : 0
    this.serving = Number(args.serving)
  }
}
