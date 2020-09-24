/**
 * foodFavoriteSummary
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodFavoriteSummary = createValidator({
  /** The amount of calcium in a meal (mg) */
  calcium: optional(t.number),
  /** The amount of calories in a meal (mg) */
  calorie: optional(t.number),
  /** The amount of carbohydrates in a meal (mg) */
  carbohydrate: optional(t.number),
  /** The amount of cholesterol in a meal (mg) */
  cholesterol: optional(t.number),
  /** The amount of fiber in a meal (mg) */
  fiber: optional(t.number),
  /** The amount of iron in a meal (mg) */
  iron: optional(t.number),
  /** The amount of monounsaturated fat in a meal (mg) */
  monounsaturatedFat: optional(t.number),
  /** The amount of polyunsaturated fat in a meal (mg) */
  polyunsaturatedFat: optional(t.number),
  /** The amount of potassium in a meal (mg) */
  potassium: optional(t.number),
  /** The amount of protein in a meal (mg) */
  protein: optional(t.number),
  /** The amount of saturated fat in a meal (mg) */
  saturatedFat: optional(t.number),
  /** The amount of sodium in a meal (mg) */
  sodium: optional(t.number),
  /** The amount of sugar in a meal (mg) */
  sugar: optional(t.number),
  /** The amount of total fat in a meal (mg) */
  totalFat: optional(t.number),
  /** The amount of trans fat in a meal (mg) */
  transFat: optional(t.number),
  /** The amount of vitamin A in a meal (mg) */
  vitaminA: optional(t.number),
  /** The amount of vitamin B in a meal (mg) */
  vitaminB: optional(t.number),
  /** The amount of vitamin C in a meal (mg) */
  vitaminC: optional(t.number)
});
