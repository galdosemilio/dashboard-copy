/**
 * GET /nutrition/summary
 */

export interface GetSummaryNutritionResponse {
  /** Nutrition summary data items, aggregated over selected unit of time. */
  data: Array<{
    /** Date of entry. For week and month, defaults to first day of week or month respectively. */
    date: string;
    /** Count of distinct dates that have recorded consumption entries. */
    recordedDateCount: number;
    /** Calorie consumption data. */
    calories?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Protein consumption data. */
    protein?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Carbs consumption data. */
    carbohydrates?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Fiber consumption data. */
    fiber?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Sugar consumption data. */
    sugar?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Potassium consumption data. */
    potassium?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Sodium consumption data. */
    sodium?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Total fat consumption data. */
    totalFat?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Saturated fat consumption data. */
    saturatedFat?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
    /** Cholesterol consumption data. */
    cholesterol?: {
      /** Daily average consumption value. */
      dailyAverage: number;
      /** Total consumed value. */
      total: number;
    };
  }>;
}
