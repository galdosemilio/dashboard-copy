import { FetchAllConsumedKeyResponse } from '@coachcare/sdk'

export interface FoodKeyData {
  key: string
  name: string
  quantity: number
}

export interface FoodKeySegment {
  date: any
  [name: string]: FoodKeyData
}
