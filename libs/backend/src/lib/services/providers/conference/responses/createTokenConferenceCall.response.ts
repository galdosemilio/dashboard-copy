/**
 * POST /conference/video/token
 */

export interface CreateTokenConferenceCallResponse {
  /** Stringified JWT access token. */
  jwt: string;
}
