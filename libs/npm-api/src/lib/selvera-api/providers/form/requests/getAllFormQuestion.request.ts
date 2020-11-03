/**
 * GET /content/form/question
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetAllFormQuestionRequest {
    /** Id of form section. */
    section: string;
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Number of items to offset from beginning of the result set. */
    offset?: PageOffset;
}
