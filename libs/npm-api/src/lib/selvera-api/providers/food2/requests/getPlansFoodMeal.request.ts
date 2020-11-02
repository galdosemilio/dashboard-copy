/**
 * GET /food/meal-plan
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetPlansFoodMealRequest {
    /** Organization for which the meal plan should be retrieved. */
    organization: string;
    /**
     * Package for which the associated meal plans should be fetched.
     * Can be 'none' to select just meal plans without an associated package.
     */
    package?: string;
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Number of meals to offset from beginning of query. */
    offset?: PageOffset;
}
