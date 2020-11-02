/**
 * GET /food/favorite
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetAllFoodFavoriteRequest {
    /** Account of the user who has favorite meals to search for. Optional for Client requests, otherwise required. */
    account?: string;
    /** Filter by the name of the meal. */
    filter?: string;
    /** Number of records to offset. */
    offset?: PageOffset;
    /** Number of records per page. Can either be "all" (a string) or a number. */
    limit?: PageSize;
}
