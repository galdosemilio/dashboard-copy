/**
 * MeetingLocation
 */

export interface MeetingLocation {
  /** The street address of the meeting. */
  streetAddress: string;
  /** The city in which the meeting takes place. */
  city: string;
  /** The postal code for the address. */
  postalCode: string;
  /** The state in which the meeting takes palce. */
  state: string;
  /** The country in which the meeting takes place. */
  country: string;
  /** The latitude for the meeting. */
  latitude?: string;
  /** The longigtude for the meeting. */
  longitude?: string;
}
