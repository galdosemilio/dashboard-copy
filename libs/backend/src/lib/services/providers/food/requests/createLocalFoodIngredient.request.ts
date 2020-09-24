/**
 * POST /food/ingredient/local
 */

import { Image, IngredientType } from '../../../shared';

export interface CreateLocalFoodIngredientRequest {
  /** Name of the ingredient. */
  name: string;
  /** Account ID for a private ingredient. Required for provider calls, clients will have it populated by default. */
  account?: string;
  /** Type of the ingredient. */
  type?: IngredientType;
  /** Brand of the ingredient. */
  brand?: string;
  /** UPC code. */
  upcCode?: string;
  /** Image data. Has to have at least 1 property defined when present. */
  image?: Partial<Image>;
  servings: {
    /** External ID of a serving. */
    externalId?: string;
    /** The amount of available carbohydrates in a serving (mg) */
    availableCarbohydrate?: number;
    /** The amount of calcium in a serving (mg) */
    calcium?: number;
    /** The amount of calories in a serving (mg) */
    calorie?: number;
    /** The amount of carbohydrates in a serving (mg) */
    carbohydrate?: number;
    /** The amount of cholesterol in a serving (mg) */
    cholesterol?: number;
    /** The amount of fiber in a serving (mg) */
    fiber?: number;
    /** The amount of iron in a serving (mg) */
    iron?: number;
    /** The amount of monounsaturated fat in a serving (mg) */
    monounsaturatedFat?: number;
    /** The amount of polyunsaturated fat in a serving (mg) */
    polyunsaturatedFat?: number;
    /** The amount of potassium in a serving (mg) */
    potassium?: number;
    /** The amount of protein in a serving (mg) */
    protein?: number;
    /** The amount of saturated fat in a serving (mg) */
    saturatedFat?: number;
    /** The amount of sodium in a serving (mg) */
    sodium?: number;
    /** The amount of sugar in a serving (mg) */
    sugar?: number;
    /** The amount of total fat in a serving (mg) */
    totalFat?: number;
    /** The amount of trans fat in a serving (mg) */
    transFat?: number;
    /** The amount of vitamin A in a serving (mg) */
    vitaminA?: number;
    /** The amount of vitamin B in a serving (mg) */
    vitaminB?: number;
    /** The amount of vitamin C in a serving (mg) */
    vitaminC?: number;
  };
}
