/**
 * GET /food/meal/organization/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { FoodMealOrganizationSingle } from './foodMealOrganization.single';

export const foodMealOrganizationSingle = createValidator({
  /** Association ID. */
  id: t.string,
  /** The id of the meal from association. */
  mealId: t.string,
  /** The id of the organization from association. */
  organization: t.string,
  /** Indicates whether association is active or not. */
  isActive: t.boolean
});

export const foodMealOrganizationResponse = createTestFromValidator<FoodMealOrganizationSingle>(
  'FoodMealOrganizationSingle',
  foodMealOrganizationSingle
);
