/**
 * GET /food/meal/:id
 */

export interface GetSingleFoodMealRequest {
    /** The meal id of the record. */
    id: string;
    /** Organization in context of which the meal should be fetched. Required to populate meal plans. */
    organization?: string;
}
