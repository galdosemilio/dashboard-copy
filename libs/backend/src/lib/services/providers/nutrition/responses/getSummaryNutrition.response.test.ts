/**
 * GET /nutrition/summary
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetSummaryNutritionResponse } from './getSummaryNutrition.response';

export const getSummaryNutritionResponse = createTest<GetSummaryNutritionResponse>(
  'GetSummaryNutritionResponse',
  {
    /** Nutrition summary data items, aggregated over selected unit of time. */
    data: t.array(
      createValidator({
        /** Date of entry. For week and month, defaults to first day of week or month respectively. */
        date: t.string,
        /** Count of distinct dates that have recorded consumption entries. */
        recordedDateCount: t.number,
        /** Calorie consumption data. */
        calories: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Protein consumption data. */
        protein: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Carbs consumption data. */
        carbohydrates: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Fiber consumption data. */
        fiber: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Sugar consumption data. */
        sugar: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Potassium consumption data. */
        potassium: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Sodium consumption data. */
        sodium: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Total fat consumption data. */
        totalFat: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Saturated fat consumption data. */
        saturatedFat: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        ),
        /** Cholesterol consumption data. */
        cholesterol: optional(
          createValidator({
            /** Daily average consumption value. */
            dailyAverage: t.number,
            /** Total consumed value. */
            total: t.number
          })
        )
      })
    )
  }
);
