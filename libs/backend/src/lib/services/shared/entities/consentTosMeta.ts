/**
 * ConsentTosMeta
 */

export interface ConsentTosMeta {
  /** ToS group ID. */
  id: number;
  /** ToS title. */
  title: string;
  /** ToS meta-description. */
  description?: string;
  /** A flag indicating whether the ToS should be accessible to anonymous/unauthenticated users. */
  allowAnonymousAccess?: boolean;
}
