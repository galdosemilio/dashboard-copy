/**
 * Interface for GET /food
 */

export interface FetchAllFoodRequest {
    query: string;
    account?: number;
    types: Array<'natural' | 'local' | 'branded' | 'common' | 'upc'>;
    offset?: number;
}
