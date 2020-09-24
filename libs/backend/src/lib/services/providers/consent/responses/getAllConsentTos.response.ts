/**
 * GET /consent/tos
 */

export interface GetAllConsentTosResponse {
  data: {
    /** Content for the particular version of ToS. */
    content: string;
    /** String array of organizations. */
    organizations: Array<string>;
    /** Business-oriented version number of ToS. */
    version: number;
    /** Creation date of the ToS version. */
    createdAt: string;
  };
  meta: {
    /** A flag indicating whether the ToS should be accessible to anonymous/unauthenticated users. */
    allowAnonymousAccess?: boolean;
  };
}
