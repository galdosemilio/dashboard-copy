/**
 * PATCH /food/serving/:id
 */

export interface UpdateFoodServingRequest {
  /** Local ID of a serving. */
  id: string;
  /** A description of a serving. */
  description?: string;
  /** A measurement description. */
  measurementDescription?: string;
  /** Unit of a serving. */
  unit?: string;
  /** Amount of a serving in the specified unit. */
  amount?: number;
  /**
   * Indicates whether the serving is a default serving for an ingredient.
   * Only one serving can be a default serving for an ingredient.
   */
  isDefault?: boolean;
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
}
