/**
 * GET /content/form/:id
 */

export interface GetSingleFormRequest {
    /** Form ID. */
    id: string;
    /** A flag indicating whether to include full form data, including sections & questions. */
    full?: boolean;
}
