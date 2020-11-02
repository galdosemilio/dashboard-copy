/**
 * POST /food/meal
 */

import { ImageUpload } from '../entities';

export interface CreateFoodMealRequest {
    /** The name of the meal that is being added. */
    name: string;
    /** The id of the account that is adding the meal. */
    account: string;
    /** The the image associated with this meal. */
    image?: ImageUpload;
    /** The array of meal serving. */
    servings?: Array<{
        /** Serving ID. If ingredient.isLocal is true, this must be the local serving ID. Otherwise it should be a remote serving ID. */
        id: string;
        /** A quantity of serving. */
        quantity?: number;
        /** The ingredient that is being added to this meal. */
        ingredient: {
            /** The id of the ingredient being added. */
            id: string;
            /** Flag saying if ingredient is local or remote. */
            isLocal: boolean;
        };
    }>;
}
