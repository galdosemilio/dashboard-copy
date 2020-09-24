/**
 * GET /food/serving/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../../../shared/index.test';
import { FoodServingSingle } from './foodServing.single';

export const foodServingSingle = createValidator({
  /** Local ID of a serving. */
  id: t.string,
  /** A description of a serving. */
  description: t.string,
  /** A measurement description. */
  measurementDescription: t.string,
  /** Unit of a serving. */
  unit: t.string,
  /** Associated ingredient. Available on GetSingle only. */
  ingredient: createValidator({
    /** ID of the associated ingredient. */
    id: t.string,
    /** Account information. Only included for private and local ingredients. */
    account: optional(entity)
  }),
  /** Amount of a serving in the specified unit. */
  amount: t.number,
  /**
   * Indicates whether the serving is a default serving for an ingredient.
   * Only one serving can be a default serving for an ingredient.
   */
  isDefault: t.boolean,
  /** External ID of a serving. Only included if the serving is local and mapped from external source. */
  externalId: optional(t.string),
  /** The amount of available carbohydrates in a serving (mg) */
  availableCarbohydrate: optional(t.number),
  /** The amount of calcium in a serving (mg) */
  calcium: optional(t.number),
  /** The amount of calories in a serving (mg) */
  calorie: optional(t.number),
  /** The amount of carbohydrates in a serving (mg) */
  carbohydrate: optional(t.number),
  /** The amount of cholesterol in a serving (mg) */
  cholesterol: optional(t.number),
  /** The amount of fiber in a serving (mg) */
  fiber: optional(t.number),
  /** The amount of iron in a serving (mg) */
  iron: optional(t.number),
  /** The amount of monounsaturated fat in a serving (mg) */
  monounsaturatedFat: optional(t.number),
  /** The amount of polyunsaturated fat in a serving (mg) */
  polyunsaturatedFat: optional(t.number),
  /** The amount of potassium in a serving (mg) */
  potassium: optional(t.number),
  /** The amount of protein in a serving (mg) */
  protein: optional(t.number),
  /** The amount of saturated fat in a serving (mg) */
  saturatedFat: optional(t.number),
  /** The amount of sodium in a serving (mg) */
  sodium: optional(t.number),
  /** The amount of sugar in a serving (mg) */
  sugar: optional(t.number),
  /** The amount of total fat in a serving (mg) */
  totalFat: optional(t.number),
  /** The amount of trans fat in a serving (mg) */
  transFat: optional(t.number),
  /** The amount of vitamin A in a serving (mg) */
  vitaminA: optional(t.number),
  /** The amount of vitamin B in a serving (mg) */
  vitaminB: optional(t.number),
  /** The amount of vitamin C in a serving (mg) */
  vitaminC: optional(t.number),
  /**
   * A flag indicating if the serving is a locally sourced serving.
   * It will always be 'true', since all servings looked up in this endpoint are local.
   */
  isLocal: t.boolean
});

export const foodServingResponse = createTestFromValidator<FoodServingSingle>(
  'FoodServingSingle',
  foodServingSingle
);
