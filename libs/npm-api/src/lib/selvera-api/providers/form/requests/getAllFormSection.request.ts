/**
 * GET /content/form/section
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetAllFormSectionRequest {
    /** Form id. */
    form: string;
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Number of items to offset from beginning of the result set. */
    offset?: PageOffset;
}
