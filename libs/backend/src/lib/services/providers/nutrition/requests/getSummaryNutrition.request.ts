/**
 * GET /nutrition/summary
 */

export interface GetSummaryNutritionRequest {
  /** Properties to be selected. */
  data:
    | 'calories'
    | 'protein'
    | 'carbohydrates'
    | 'fiber'
    | 'sugar'
    | 'potassium'
    | 'sodium'
    | 'totalFat'
    | 'saturatedFat'
    | 'cholesterol';
  /** Account for which the summary should be retrieved. */
  account: string;
  /** Start date for the summary. */
  startDate: string;
  /** End date for the summary. */
  endDate?: string;
  /** Unit of aggregation for the summary. */
  unit: string;
}
