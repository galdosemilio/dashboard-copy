/**
 * foodConsumedSummary
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const foodConsumedSummary = createValidator({
  /** The amount of available carbohydrates in a consumed entry (mg) */
  availableCarbohydrate: optional(t.number),
  /** The amount of calcium in a consumed entry (mg) */
  calcium: optional(t.number),
  /** The amount of calories in a consumed entry (mg) */
  calorie: optional(t.number),
  /** The amount of carbohydrates in a consumed entry (mg) */
  carbohydrate: optional(t.number),
  /** The amount of cholesterol in a consumed entry (mg) */
  cholesterol: optional(t.number),
  /** The amount of fiber in a consumed entry (mg) */
  fiber: optional(t.number),
  /** The amount of iron in a consumed entry (mg) */
  iron: optional(t.number),
  /** The amount of monounsaturated fat in a consumed entry (mg) */
  monounsaturatedFat: optional(t.number),
  /** The amount of polyunsaturated fat in a consumed entry (mg) */
  polyunsaturatedFat: optional(t.number),
  /** The amount of potassium in a consumed entry (mg) */
  potassium: optional(t.number),
  /** The amount of protein in a consumed entry (mg) */
  protein: optional(t.number),
  /** The amount of saturated fat in a consumed entry (mg) */
  saturatedFat: optional(t.number),
  /** The amount of sodium in a consumed entry (mg) */
  sodium: optional(t.number),
  /** The amount of sugar in a consumed entry (mg) */
  sugar: optional(t.number),
  /** The amount of total fat in a consumed entry (mg) */
  totalFat: optional(t.number),
  /** The amount of trans fat in a consumed entry (mg) */
  transFat: optional(t.number),
  /** The amount of vitamin A in a consumed entry (mg) */
  vitaminA: optional(t.number),
  /** The amount of vitamin B in a consumed entry (mg) */
  vitaminB: optional(t.number),
  /** The amount of vitamin C in a consumed entry (mg) */
  vitaminC: optional(t.number)
});
