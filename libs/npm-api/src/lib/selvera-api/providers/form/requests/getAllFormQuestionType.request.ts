/**
 * GET /content/form/question-type
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetAllFormQuestionTypeRequest {
    /** Filter by question type name or description. */
    query?: string;
    /** A status of the question type items to include. */
    status?: 'all' | 'active' | 'inactive';
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Number of items to offset from beginning of the result set. */
    offset?: PageOffset;
}
