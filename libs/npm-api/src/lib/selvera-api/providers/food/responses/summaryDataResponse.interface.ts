/**
 * Interface for SummaryDataResponse
 */

import { SummaryDataResponseNutrient } from './summaryDataResponseNutrient.interface'

export interface SummaryDataResponse {
  date: string
  recordedDateCount: number
  calories?: SummaryDataResponseNutrient
  protein?: SummaryDataResponseNutrient
  carbohydrates?: SummaryDataResponseNutrient
  fiber?: SummaryDataResponseNutrient
  sugar?: SummaryDataResponseNutrient
  potassium?: SummaryDataResponseNutrient
  sodium?: SummaryDataResponseNutrient
  totalFat?: SummaryDataResponseNutrient
  saturatedFat?: SummaryDataResponseNutrient
  cholesterol?: SummaryDataResponseNutrient
}
