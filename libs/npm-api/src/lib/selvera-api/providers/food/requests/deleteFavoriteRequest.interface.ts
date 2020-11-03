/**
 * Interface for Delete /food/favorite
 */

export interface DeleteFavoriteMealRequest {
    mealId: number | string;
    account?: number;
}
