/**
 * Interface for GET /food/meal
 */

export interface FetchAllMealRequest {
    account?: number;
    category?: string;
    filter?: string;
    endDate?: string;
    limit?: number | string;
    mealIds?: Array<string>;
    offset?: number;
    order?: 'createdAsc' | 'createdDesc' | 'nameAsc' | 'nameDesc';
    organization?: string;
    organizationHierachy?: string;
    plan?: string;
    startDate?: string;
    type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    vendor?: string;
}
