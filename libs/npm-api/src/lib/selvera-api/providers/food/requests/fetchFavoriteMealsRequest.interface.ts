/**
 * Interface for GET /food/favorite
 */

export interface FetchFavoriteMealsRequest {
    account?: number;
    filter?: string;
    order?: 'createdAsc' | 'createdDesc' | 'nameAsc' | 'nameDesc';
    status?: 'public' | 'private';
    offset?: number;
}
