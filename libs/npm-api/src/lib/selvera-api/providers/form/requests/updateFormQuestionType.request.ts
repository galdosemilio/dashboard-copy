/**
 * PATCH /content/form/question-type/:id
 */

export interface UpdateFormQuestionTypeRequest {
    /** ID of the question type to retrieve. */
    id: string;
    /** Question type name. */
    name?: string;
    /** Question type description. */
    description?: string;
    /** A flag indicating if the question type is active. */
    isActive?: boolean;
}
