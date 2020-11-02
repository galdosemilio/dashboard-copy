/**
 * Interface for GET /food/meal-plan
 */

export interface FetchMealPlansRequest {
    organization: string;
    recipesOnly?: boolean;
    package: number | 'none';
    limit?: number;
    offset?: number;
}
