export interface CloneFormRequest {
    /** ID of a form to be cloned */
    form: string;
    /** ID of an organization for which form clone is being created  */
    organization: string;
}
