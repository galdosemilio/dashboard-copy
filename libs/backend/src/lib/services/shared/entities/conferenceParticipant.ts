/**
 * ConferenceParticipant
 */

export interface ConferenceParticipant {
  /** Account ID. */
  id: string;
  /**
   * First name.
   * Account data is eventually consistent and might not _always_ be available,
   * although it should be available most of the time.
   */
  firstName?: string;
}
