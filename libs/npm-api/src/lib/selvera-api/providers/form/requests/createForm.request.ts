/**
 * POST /content/form
 */

export interface CreateFormRequest {
    /** Form name. */
    name: string;
    /** The organization ID for which the form is being created. */
    organization: string;
    /** A flag indicating if the form allows adding addendums. */
    allowAddendum: boolean;
    /** Maximum allowed submissions for a form. */
    maximumSubmissions?: number;
    /** A flag indicating if the form is active. */
    isActive?: boolean;
    /** A flag indicating if the form supports submission removal */
    removableSubmissions?: boolean;
}
