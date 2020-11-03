/**
 * Interface for GET /food/ingredient
 */

export interface FetchSingleIngredientRequest {
    id: string;
    type: 'natural' | 'local' | 'branded' | 'common' | 'upc';
}
