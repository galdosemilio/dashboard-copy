/**
 * Interface for POST /food/favorite
 */

export interface AddFavoriteMealRequest {
    account?: number;
    mealId: number | string;
}
