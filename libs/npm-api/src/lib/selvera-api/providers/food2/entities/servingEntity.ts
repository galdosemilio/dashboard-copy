/**
 * ServingEntity
 */

import { IngredientEntity } from './ingredientEntity';

export interface ServingEntity {
    /** Serving ID. */
    id: string;
    /** Ingredient associated with the serving. */
    ingredient: IngredientEntity;
}
