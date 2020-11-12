/**
 * Interface for GET chart/calorie (response)
 */

import { CalorieDataSegment } from './calorieDataSegment.interface'
import { CalorieSummary } from './calorieSummary.interface'

export interface CalorieResponse {
  data: Array<CalorieDataSegment>
  summary: CalorieSummary
}
