/**
 * FoodConsumedFrequently
 */

import { Entity } from '../generic';
import { FoodFrequentSummary } from './foodFrequentSummary';
import { FoodMealConsumption } from './foodMealConsumption';

export interface FoodConsumedFrequently {
  /** The id of the meal record. */
  id: string;
  /** The name of the meal record. */
  name: string;
  /** The timestamp of when the meal was created. */
  createdAt: string;
  /** The image url of the meal. */
  imageUrl?: string;
  /** Flag showing if meal is public (does not have associated account) */
  isPublic: boolean;
  /** Account associated with this meal. */
  account?: Entity;
  /** Consumption information. This is calculated between specific start & end dates, if there are any bounds provided. */
  consumption: FoodMealConsumption;
  /** Aggregation of nutrition values for the whole meal. */
  summary: Partial<FoodFrequentSummary>;
}
