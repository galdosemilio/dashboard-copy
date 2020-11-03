/**
 * POST /food/ingredient/local
 */

export interface CreateLocalFoodIngredientResponse {
    servings: {
        /**
         * Indicates whether the serving is a default serving for an ingredient.
         * Only one serving can be a default serving for an ingredient.
         */
        isDefault: boolean;
    };
    /** ID of the ingredient. */
    id: string;
}
