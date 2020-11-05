import { FetchAllConsumedKeyResponse } from '@coachcare/npm-api'

export interface FoodKeyData {
  key: string
  name: string
  quantity: number
}

export interface FoodKeySegment {
  date: any
  [name: string]: FoodKeyData
}
