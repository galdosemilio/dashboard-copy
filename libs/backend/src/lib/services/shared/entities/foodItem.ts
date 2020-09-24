/**
 * FoodItem
 */

import { FoodType } from './foodType';

export interface FoodItem {
  /** Remote food item (ingredient) ID. */
  id: string;
  /** Food item name. */
  name: string;
  /** Food item description. */
  description: string;
  /** Brand name. */
  brand?: string;
  /** URL of the food item. */
  url?: string;
  /** Type of the food item. */
  type: FoodType;
}
