/**
 * POST /consent/tos
 */

export interface CreateConsentTosRequest {
  /** Terms of Service metadata object. */
  meta: {
    /** ToS ID. Can be null if a new ToS should be created. If it's not null, a new ToS version will be attached to existing ToS. */
    id?: number;
    /** ToS title. Required to create a new ToS object. Can be skipped if using existing ToS ID. */
    title?: string;
    /** Meta-description. */
    description?: string;
    /**
     * A flag indicating whether the ToS should be viewable by anonymous/unauthenticated users.
     * Required to create a new ToS object.
     */
    allowAnonymousAccess?: boolean;
  };
  /** Content for this version of Terms of Service. Cannot be empty. */
  content: string;
  /** Business-oriented version number of ToS. */
  version: number;
  /** Array of strings determining organizations. Can be null if ToS version should apply to everyone, including private accounts. */
  organizations?: Array<string>;
}
