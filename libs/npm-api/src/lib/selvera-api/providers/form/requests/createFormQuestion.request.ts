/**
 * POST /content/form/question
 */

export interface CreateFormQuestionRequest {
    /** Section id. */
    section: string;
    /** Question type id. */
    questionType: string;
    /** Question title. */
    title: string;
    /** Question description. */
    description?: string;
    /**
     * Order number of question within section.
     * Questions with equal or greater order number than given are pushed down - order number is increased.
     */
    sortOrder: number;
    /** Indicates wether question should be answered or not. */
    isRequired?: boolean;
    /** A collection of allowed responses to the question. */
    allowedValues?: Array<string>;
}
