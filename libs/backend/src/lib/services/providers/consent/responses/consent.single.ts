/**
 * GET /consent/:id
 */

export interface ConsentSingle {
  consent: {
    /** ID of the ToS version the action was taken upon. */
    tosVersionId: string;
    /** Action taken. */
    action: string;
    /** Organization for which the action was taken. Can be null for personal account consents. */
    organization?: string;
    /** Creation date of the consent. */
    timestamp: string;
  };
  consents: {
    /** Account which has actually submitted the consent. */
    createdBy: string;
  };
}
